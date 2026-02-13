'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Building2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  getSchools,
  searchSchools,
  getSchoolsByRegion,
  GHANA_REGIONS,
  INDEPENDENT_LEARNER,
  requestNewSchool,
  School,
} from '@/lib/schools';
import { useTenant } from '@/hooks/useTenant';

interface SchoolSelectorProps {
  value?: string;
  onChange: (school: School | null) => void;
  required?: boolean;
}

export default function SchoolSelector({ value, onChange, required = false }: SchoolSelectorProps) {
  const { tenant } = useTenant();
  const [hasSchool, setHasSchool] = useState<'yes' | 'no' | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  
  // Determine if we should show Ghana-specific school selector
  const isGhanaMarket = tenant.market === 'ghana' || tenant.market === 'west-africa' || tenant.market === 'global';
  
  // Request new school form
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolRegion, setNewSchoolRegion] = useState('');
  const [newSchoolTown, setNewSchoolTown] = useState('');
  const [newSchoolType, setNewSchoolType] = useState<School['type']>('JHS');

  const filteredSchools = useMemo(() => {
    let schools = searchQuery ? searchSchools(searchQuery) : getSchools();
    
    if (selectedRegion && selectedRegion !== 'All Regions') {
      schools = schools.filter(s => s.region === selectedRegion);
    }
    
    return schools;
  }, [searchQuery, selectedRegion]);

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    onChange(school);
  };

  const handleIndependentLearner = () => {
    setHasSchool('no');
    setSelectedSchool(INDEPENDENT_LEARNER);
    onChange(INDEPENDENT_LEARNER);
  };

  const handleRequestNewSchool = () => {
    if (!newSchoolName || !newSchoolRegion) return;
    
    const newSchool = requestNewSchool({
      name: newSchoolName,
      region: newSchoolRegion,
      town: newSchoolTown,
      type: newSchoolType,
    });
    
    handleSchoolSelect(newSchool);
    setShowRequestDialog(false);
    
    // Reset form
    setNewSchoolName('');
    setNewSchoolRegion('');
    setNewSchoolTown('');
    setNewSchoolType('JHS');
  };

  const getSchoolTypeColor = (type: School['type']) => {
    switch (type) {
      case 'JHS': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'SHS': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'Private': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'Islamic': return 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300';
      case 'International': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'Basic': return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Step 1: Do you attend a school? */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          School Information {!required && <span className="text-sm font-normal text-muted-foreground">(Optional)</span>}
        </Label>
        <RadioGroup
          value={hasSchool || ''}
          onValueChange={(val) => {
            setHasSchool(val as 'yes' | 'no');
            if (val === 'no') {
              handleIndependentLearner();
            } else {
              setSelectedSchool(null);
              onChange(null);
            }
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="school-yes" />
            <Label htmlFor="school-yes" className="font-normal cursor-pointer">
              {isGhanaMarket ? 'I attend a school in Ghana' : 'I attend a school/institution'}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="school-no" />
            <Label htmlFor="school-no" className="font-normal cursor-pointer">
              I'm learning independently
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Step 2: School Selection (if hasSchool === 'yes') */}
      {hasSchool === 'yes' && isGhanaMarket && (
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Region Filter */}
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Regions">All Regions</SelectItem>
                  {GHANA_REGIONS.map(region => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* School Search */}
            <div className="space-y-2">
              <Label htmlFor="school-search">Search for your school</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="school-search"
                  type="text"
                  placeholder="Type school name or town..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Schools List */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {filteredSchools.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="mb-2">No schools found</p>
                  <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Request to add your school
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request New School</DialogTitle>
                        <DialogDescription>
                          We'll review and add your school to the database
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-school-name">School Name *</Label>
                          <Input
                            id="new-school-name"
                            placeholder="e.g., Tema Methodist Day JHS"
                            value={newSchoolName}
                            onChange={(e) => setNewSchoolName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-school-region">Region *</Label>
                          <Select value={newSchoolRegion} onValueChange={setNewSchoolRegion}>
                            <SelectTrigger id="new-school-region">
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                              {GHANA_REGIONS.map(region => (
                                <SelectItem key={region} value={region}>
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-school-town">Town/City</Label>
                          <Input
                            id="new-school-town"
                            placeholder="e.g., Tema"
                            value={newSchoolTown}
                            onChange={(e) => setNewSchoolTown(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-school-type">School Type</Label>
                          <Select value={newSchoolType} onValueChange={(val) => setNewSchoolType(val as School['type'])}>
                            <SelectTrigger id="new-school-type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="JHS">Junior High School (JHS)</SelectItem>
                              <SelectItem value="SHS">Senior High School (SHS)</SelectItem>
                              <SelectItem value="Basic">Basic School</SelectItem>
                              <SelectItem value="Private">Private School</SelectItem>
                              <SelectItem value="Islamic">Islamic School</SelectItem>
                              <SelectItem value="International">International School</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          onClick={handleRequestNewSchool}
                          disabled={!newSchoolName || !newSchoolRegion}
                          className="w-full"
                        >
                          Submit Request
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                filteredSchools.map((school) => (
                  <button
                    key={school.id}
                    onClick={() => handleSchoolSelect(school)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedSchool?.id === school.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold truncate">{school.name}</p>
                          {selectedSchool?.id === school.id && (
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {school.town ? `${school.town}, ` : ''}{school.region}
                          </span>
                        </div>
                      </div>
                      <Badge className={getSchoolTypeColor(school.type)}>
                        {school.type}
                      </Badge>
                    </div>
                    {school.motto && (
                      <p className="text-xs italic text-muted-foreground mt-2">
                        "{school.motto}"
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Can't find school link */}
            {filteredSchools.length > 0 && (
              <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
                <DialogTrigger asChild>
                  <Button variant="link" className="w-full text-sm">
                    Can't find your school? Click to add it
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request New School</DialogTitle>
                    <DialogDescription>
                      We'll review and add your school to the database
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-school-name">School Name *</Label>
                      <Input
                        id="new-school-name"
                        placeholder="e.g., Tema Methodist Day JHS"
                        value={newSchoolName}
                        onChange={(e) => setNewSchoolName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-school-region">Region *</Label>
                      <Select value={newSchoolRegion} onValueChange={setNewSchoolRegion}>
                        <SelectTrigger id="new-school-region">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {GHANA_REGIONS.map(region => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-school-town">Town/City</Label>
                      <Input
                        id="new-school-town"
                        placeholder="e.g., Tema"
                        value={newSchoolTown}
                        onChange={(e) => setNewSchoolTown(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-school-type">School Type</Label>
                      <Select value={newSchoolType} onValueChange={(val) => setNewSchoolType(val as School['type'])}>
                        <SelectTrigger id="new-school-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JHS">Junior High School (JHS)</SelectItem>
                          <SelectItem value="SHS">Senior High School (SHS)</SelectItem>
                          <SelectItem value="Basic">Basic School</SelectItem>
                          <SelectItem value="Private">Private School</SelectItem>
                          <SelectItem value="Islamic">Islamic School</SelectItem>
                          <SelectItem value="International">International School</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleRequestNewSchool}
                      disabled={!newSchoolName || !newSchoolRegion}
                      className="w-full"
                    >
                      Submit Request
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      )}

      {/* Simple school name input for non-Ghana markets */}
      {hasSchool === 'yes' && !isGhanaMarket && (
        <div className="space-y-2">
          <Label htmlFor="school-name">School/Institution Name</Label>
          <Input
            id="school-name"
            placeholder={`Enter your school or institution name`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Create a simple school object
              if (e.target.value.trim()) {
                const customSchool: School = {
                  id: `custom-${Date.now()}`,
                  name: e.target.value,
                  region: tenant.branding.countryLabel || 'Location',
                  type: 'Private',
                  town: '',
                  verified: false,
                  studentCount: 0,
                };
                handleSchoolSelect(customSchool);
              } else {
                onChange(null);
              }
            }}
          />
          <p className="text-xs text-muted-foreground">Optional: Enter your school or institution name</p>
        </div>
      )}

      {/* Selected School Display */}
      {selectedSchool && (
        <Card className="border-2 border-primary">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Check className="h-5 w-5 text-primary" />
                  <p className="font-semibold">Selected School:</p>
                </div>
                <p className="text-lg font-bold">{selectedSchool.name}</p>
                {selectedSchool.id !== INDEPENDENT_LEARNER.id && (
                  <p className="text-sm text-muted-foreground">
                    {selectedSchool.town ? `${selectedSchool.town}, ` : ''}{selectedSchool.region}
                  </p>
                )}
              </div>
              <Badge className={getSchoolTypeColor(selectedSchool.type)}>
                {selectedSchool.type}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
