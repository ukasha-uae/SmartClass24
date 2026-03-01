import { AmmoniaTestLab } from "@/components/virtual-labs/ammonia-test-lab-enhanced";
import { AcidBaseNeutralizationLabEnhanced as AcidBaseNeutralizationLab } from "@/components/virtual-labs/acid-base-neutralization-lab";
import { BiuretTestLabEnhanced as BiuretTestLab } from "@/components/virtual-labs/biuret-test-lab-enhanced";
import { CellDivisionLabEnhanced as CellDivisionLab } from "@/components/virtual-labs/cell-division-lab-enhanced";
import { CondensationLabEnhanced } from "@/components/virtual-labs/condensation-lab-enhanced";
import { DensityLabEnhanced } from "@/components/virtual-labs/density-lab-enhanced";
import { EnzymeStarchLabEnhanced as EnzymeStarchLab } from "@/components/virtual-labs/enzyme-starch-lab-enhanced";
import { EvaporationLabEnhanced } from "@/components/virtual-labs/evaporation-lab-enhanced";
import { ThermalExpansionLabEnhanced } from "@/components/virtual-labs/thermal-expansion-lab-enhanced";
import { ExpansionOfAirLabEnhanced } from "@/components/virtual-labs/expansion-of-air-lab-enhanced";
import { FlameTestLabEnhanced as FlameTestLab } from "@/components/virtual-labs/flame-test-lab-v2";
import { FoodTestLabEnhanced as FoodTestLab } from "@/components/virtual-labs/food-test-lab-enhanced";
import { GreaseSpotTestLabEnhanced as GreaseSpotTestLab } from "@/components/virtual-labs/grease-spot-test-lab-enhanced";
import { HeatTransferLabEnhanced } from "@/components/virtual-labs/heat-transfer-lab-enhanced";
import { HookesLawLabEnhanced } from "@/components/virtual-labs/hookes-law-lab-enhanced";
import { HydrogenPopTestLab } from "@/components/virtual-labs/hydrogen-pop-test-lab-enhanced";
import { LimewaterTestLabEnhanced as LimewaterTestLab } from "@/components/virtual-labs/limewater-test-lab-enhanced";
import { LitmusTestLab } from "@/components/virtual-labs/litmus-test-lab-enhanced";
import { MagneticFieldLabEnhanced as MagneticFieldLab } from "@/components/virtual-labs/magnetic-field-lab-enhanced";
import { MetalAcidReactionLabEnhanced as MetalAcidReactionLab } from "@/components/virtual-labs/metal-acid-reaction-lab-enhanced";
import { NeutralizationReactionLabEnhanced } from "@/components/virtual-labs/neutralization-reaction-lab-enhanced";
import { OhmsLawLabEnhanced as OhmsLawLab } from "@/components/virtual-labs/ohms-law-lab-enhanced";
import { OxygenTestLabEnhanced as OxygenTestLab } from "@/components/virtual-labs/oxygen-test-lab-enhanced";
import { OsmosisLabEnhanced as OsmosisLab } from "@/components/virtual-labs/osmosis-lab-enhanced";
import { PhotosynthesisLabEnhanced as PhotosynthesisLab } from '@/components/virtual-labs/photosynthesis-lab-enhanced';
import { ProjectileMotionLabEnhanced as ProjectileMotionLab } from "@/components/virtual-labs/projectile-motion-lab-enhanced";
import { ReflectionLabEnhanced as ReflectionLab } from "@/components/virtual-labs/reflection-lab-enhanced";
import { RefractionLabEnhanced as RefractionLab } from "@/components/virtual-labs/refraction-lab-enhanced";
import { RespirationLabEnhanced as RespirationLab } from '@/components/virtual-labs/respiration-lab-enhanced';
import { RustingLabEnhanced as RustingLab } from "@/components/virtual-labs/rusting-lab-enhanced";
import { SeparationTechniquesLabEnhanced as SeparationTechniquesLab } from "@/components/virtual-labs/separation-techniques-lab-enhanced";
import { SimpleCircuitLabEnhanced as SimpleCircuitLab } from "@/components/virtual-labs/simple-circuit-lab-enhanced";
import { TranspirationLabEnhanced as TranspirationLab } from '@/components/virtual-labs/transpiration-lab-enhanced';
import { WaterCycleLabEnhanced as WaterCycleLab } from "@/components/virtual-labs/water-cycle-lab-enhanced";
import { WaterTestLabEnhanced as WaterTestLab } from "@/components/virtual-labs/water-test-lab-enhanced";
import { WorkEnergyLabEnhanced as WorkEnergyLab } from "@/components/virtual-labs/work-energy-lab-enhanced";
import { MathVennLabEnhanced } from "@/components/virtual-labs/math-venn-lab-enhanced";
import { EquationAnimationLabEnhanced } from "@/components/virtual-labs/equation-animation-lab-enhanced";
import { FractionsRescueLabEnhanced } from "@/components/virtual-labs/fractions-rescue-lab-enhanced";
import { ArtColorTheoryLabEnhanced } from "@/components/virtual-labs/art-color-theory-lab-enhanced";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { SolarSystemLab } from "@/components/science-simulations/SolarSystemLab";
import { EarthMoonSystemLab } from "@/components/science-simulations/EarthMoonSystemLab";


export interface VirtualLabExperiment {
    id: string;
    slug: string;
    title: string;
    subject: 'Biology' | 'Chemistry' | 'Physics' | 'Science' | 'Mathematics' | 'Art';
    track?: VirtualLabTrack;
    labAudience?: VirtualLabAudience;
    description: string;
    learningObjective?: string;
    component: React.ComponentType;
}

export type VirtualLabTrack = 'science-lab' | 'maths-lab' | 'art-lab';
export type VirtualLabAudience = 'all-levels' | 'primary-school' | 'middle-school' | 'high-school';

export const VIRTUAL_LAB_TRACK_LABELS: Record<VirtualLabTrack, string> = {
    'science-lab': 'Science Lab',
    'maths-lab': 'Maths Lab',
    'art-lab': 'Art Lab',
};

export const VIRTUAL_LAB_AUDIENCE_LABELS: Record<VirtualLabAudience, string> = {
    'all-levels': 'All Levels',
    'primary-school': 'Primary School',
    'middle-school': 'Middle School',
    'high-school': 'High School',
};

export function getVirtualLabTrack(experiment: { subject: string; track?: VirtualLabTrack }): VirtualLabTrack {
    if (experiment.track) return experiment.track;
    return experiment.subject === 'Mathematics' ? 'maths-lab' : 'science-lab';
}

export function getVirtualLabAudience(experiment: { labAudience?: VirtualLabAudience }): VirtualLabAudience {
    return experiment.labAudience ?? 'all-levels';
}

export const virtualLabExperiments: { experiments: VirtualLabExperiment[] } = {
    experiments: [
        // Mathematics Labs
        {
            id: 'math-lab-1',
            slug: 'maths-sets-venn',
            title: 'Sets & Venn Lab',
            subject: 'Mathematics',
            labAudience: 'middle-school',
            description: 'Explore union, intersection, and complement with guided checkpoints.',
            learningObjective: 'Build visual and symbolic understanding of set operations and use Venn regions to solve word problems.',
            component: MathVennLabEnhanced,
        },
        {
            id: 'math-lab-2',
            slug: 'maths-equation-animation',
            title: 'Equation Animation Lab',
            subject: 'Mathematics',
            labAudience: 'high-school',
            description: 'Use step-by-step animations to reason through linear and quadratic equations.',
            learningObjective: 'Connect algebra steps to meaning, detect misconceptions, and apply discriminant reasoning.',
            component: EquationAnimationLabEnhanced,
        },
        {
            id: 'math-lab-3',
            slug: 'maths-fractions-rescue',
            title: 'Fractions Rescue Lab',
            subject: 'Mathematics',
            labAudience: 'middle-school',
            description: 'Build fraction confidence with part-whole models, equivalence tools, and number-line practice.',
            learningObjective: 'Strengthen conceptual understanding of fractions, comparisons, and fraction-decimal bridges through guided practice.',
            component: FractionsRescueLabEnhanced,
        },
        {
            id: 'art-lab-1',
            slug: 'art-color-theory-studio',
            title: 'Color Theory Studio',
            subject: 'Art',
            track: 'art-lab',
            labAudience: 'middle-school',
            description: 'Build strong visual communication with color mixing, value, and contrast decisions.',
            learningObjective: 'Apply color-wheel logic, complementary contrast, and value control to create educationally effective visual designs.',
            component: ArtColorTheoryLabEnhanced,
        },

        // Biology Labs
        { 
            id: 'bio-lab-1', 
            slug: 'food-tests', 
            title: 'Food Tests', 
            subject: 'Biology', 
            labAudience: 'middle-school',
            description: 'Test for starch, protein, fats, and reducing sugars.', 
            learningObjective: 'Understand how to identify major nutrients in food samples using chemical indicators and reagents.',
            component: FoodTestLab 
        },
        { 
            id: 'bio-lab-2', 
            slug: 'osmosis', 
            title: 'Osmosis', 
            subject: 'Biology', 
            labAudience: 'middle-school',
            description: 'Observe how water moves across a semi-permeable membrane.', 
            learningObjective: 'Learn the process of osmosis and how concentration gradients affect water movement in cells.',
            component: OsmosisLab 
        },
        { 
            id: 'bio-lab-3', 
            slug: 'photosynthesis-oxygen-production', 
            title: 'Photosynthesis & Oxygen Production', 
            subject: 'Biology', 
            labAudience: 'middle-school',
            description: 'Investigate how light intensity affects oxygen production in plants.', 
            learningObjective: 'Discover how plants convert light energy into chemical energy and produce oxygen as a byproduct.',
            component: PhotosynthesisLab 
        },
        { 
            id: 'bio-lab-4', 
            slug: 'biuret-test-for-protein', 
            title: 'Biuret Test for Protein', 
            subject: 'Biology', 
            labAudience: 'high-school',
            description: 'Use Biuret solution to test various foods for protein.', 
            learningObjective: 'Master the technique for detecting proteins using the characteristic color change of Biuret reagent.',
            component: BiuretTestLab 
        },
        { 
            id: 'bio-lab-5', 
            slug: 'grease-spot-test-for-fats', 
            title: 'Grease Spot Test for Fats', 
            subject: 'Biology', 
            labAudience: 'middle-school',
            description: 'A simple test to see if a food contains fats or oils.', 
            learningObjective: 'Learn a quick physical method to identify lipids based on their translucent properties.',
            component: GreaseSpotTestLab 
        },
        { 
            id: 'bio-lab-6', 
            slug: 'cell-division-simulator', 
            title: 'Cell Division Simulator', 
            subject: 'Biology', 
            labAudience: 'high-school',
            description: 'Visualize the stages of mitosis and meiosis.', 
            learningObjective: 'Understand the phases of cell division and how genetic material is replicated and distributed.',
            component: CellDivisionLab 
        },
        { 
            id: 'bio-lab-7', 
            slug: 'respiration-in-seeds', 
            title: 'Respiration in Germinating Seeds', 
            subject: 'Biology', 
            labAudience: 'middle-school',
            description: 'Demonstrate that germinating seeds respire.', 
            learningObjective: 'Explore cellular respiration in living organisms and how energy is released from glucose.',
            component: RespirationLab 
        },
        { 
            id: 'bio-lab-8', 
            slug: 'transpiration-in-plants', 
            title: 'Transpiration in Plants', 
            subject: 'Biology', 
            labAudience: 'middle-school',
            description: 'Observe water loss from plant leaves.', 
            learningObjective: 'Investigate the process of water movement through plants and its role in nutrient transport.',
            component: TranspirationLab 
        },
        { 
            id: 'bio-lab-9', 
            slug: 'enzyme-starch-digestion', 
            title: 'Enzyme Action on Starch', 
            subject: 'Biology', 
            labAudience: 'middle-school',
            description: 'Simulate how amylase breaks down starch.', 
            learningObjective: 'Learn how enzymes catalyze biological reactions and the factors that affect enzyme activity.',
            component: EnzymeStarchLab 
        },

        // Physics Labs
        { 
            id: 'phy-lab-1', 
            slug: 'condensation', 
            title: 'Condensation of Water Vapor', 
            subject: 'Physics', 
            labAudience: 'middle-school',
            description: 'Observe water vapor condensing into liquid.', 
            learningObjective: 'Understand phase changes and how temperature affects the state of matter.',
            component: CondensationLabEnhanced 
        },
        { 
            id: 'phy-lab-2', 
            slug: 'evaporation-of-liquids', 
            title: 'Evaporation of Liquids', 
            subject: 'Physics', 
            labAudience: 'middle-school',
            description: 'Compare the evaporation rates of different liquids.', 
            learningObjective: 'Explore the relationship between molecular structure and evaporation rates.',
            component: EvaporationLabEnhanced 
        },
        { 
            id: 'phy-lab-3', 
            slug: 'expansion-of-solids-liquids', 
            title: 'Thermal Expansion', 
            subject: 'Physics', 
            labAudience: 'middle-school',
            description: 'See how solids and liquids expand when heated.', 
            learningObjective: 'Learn how heat energy causes matter to expand and the practical applications of this principle.',
            component: ThermalExpansionLabEnhanced 
        },
        { 
            id: 'phy-lab-4', 
            slug: 'expansion-of-air', 
            title: 'Expansion of Air', 
            subject: 'Physics', 
            labAudience: 'middle-school',
            description: 'Demonstrate that air expands when heated.', 
            learningObjective: 'Understand how gases respond to temperature changes and apply Charles\' Law.',
            component: ExpansionOfAirLabEnhanced,
        },
        { 
            id: 'phy-lab-5', 
            slug: 'density-buoyancy', 
            title: 'Density & Buoyancy', 
            subject: 'Physics', 
            labAudience: 'middle-school',
            description: 'Investigate why objects float or sink based on density.', 
            learningObjective: 'Master the concept of density and how Archimedes\' Principle explains buoyancy.',
            component: DensityLabEnhanced 
        },
        { 
            id: 'phy-lab-6', 
            slug: 'heat-transfer', 
            title: 'Heat Transfer Mechanisms', 
            subject: 'Physics', 
            labAudience: 'middle-school',
            description: 'Explore conduction, convection, and radiation.', 
            learningObjective: 'Master the three methods of heat transfer and identify real-world examples of each.',
            component: HeatTransferLabEnhanced 
        },
        { 
            id: 'phy-lab-7', 
            slug: 'hookes-law', 
            title: "Hooke's Law", 
            subject: 'Physics', 
            labAudience: 'high-school',
            description: "Investigate the relationship between force and a spring's extension.", 
            learningObjective: 'Discover the linear relationship between force and displacement in elastic materials.',
            component: HookesLawLabEnhanced 
        },
        // ✅ ENABLED - Magnetic field physics fixed with proper attraction/repulsion logic
        { 
            id: 'phy-lab-8', 
            slug: 'magnetic-field-mapping', 
            title: 'Magnetic Field Mapping', 
            subject: 'Physics', 
            labAudience: 'middle-school',
            description: 'Visualize magnetic field lines using a compass and explore how magnets attract and repel.', 
            learningObjective: 'Learn how to map invisible magnetic fields and understand that opposite poles attract while same poles repel. Aligns with GES JHS Integrated Science syllabus on magnetism.',
            component: MagneticFieldLab 
        },
        { 
            id: 'phy-lab-9', 
            slug: 'ohms-law', 
            title: "Ohm's Law", 
            subject: 'Physics', 
            labAudience: 'high-school',
            description: 'Explore the relationship between voltage, current, and resistance.', 
            learningObjective: 'Master the fundamental relationship V=IR and apply it to electrical circuit analysis.',
            component: OhmsLawLab 
        },
        { 
            id: 'phy-lab-10', 
            slug: 'projectile-motion', 
            title: 'Projectile Motion', 
            subject: 'Physics', 
            labAudience: 'high-school',
            description: 'Analyze the trajectory of a projectile.', 
            learningObjective: 'Understand how horizontal and vertical motion combine to create parabolic trajectories.',
            component: ProjectileMotionLab 
        },
        { 
            id: 'phy-lab-11', 
            slug: 'reflection-of-light', 
            title: 'Reflection of Light', 
            subject: 'Physics', 
            labAudience: 'middle-school',
            description: 'Verify the laws of reflection using a plane mirror.', 
            learningObjective: 'Learn that the angle of incidence equals the angle of reflection and apply this to real situations.',
            component: ReflectionLab 
        },
        { 
            id: 'phy-lab-12', 
            slug: 'refraction-of-light', 
            title: 'Refraction of Light', 
            subject: 'Physics', 
            labAudience: 'high-school',
            description: 'Observe how light bends when passing through different media.', 
            learningObjective: 'Explore how light changes direction at boundaries and calculate refractive indices.',
            component: RefractionLab 
        },
        { 
            id: 'phy-lab-13', 
            slug: 'simple-circuits', 
            title: 'Simple Circuits Lab', 
            subject: 'Physics', 
            labAudience: 'middle-school',
            description: 'Build and test series and parallel circuits.', 
            learningObjective: 'Understand how electrical components can be connected and how this affects current and voltage.',
            component: SimpleCircuitLab 
        },
        { 
            id: 'phy-lab-14', 
            slug: 'work-energy-inclined-plane', 
            title: 'Work & Energy on an Inclined Plane', 
            subject: 'Physics', 
            labAudience: 'high-school',
            description: 'Observe the conversion of potential energy to kinetic energy.', 
            learningObjective: 'Learn how energy is conserved and transformed from one form to another in mechanical systems.',
            component: WorkEnergyLab 
        },
        {
            id: 'sci-sim-1',
            slug: 'solar-system',
            title: 'Solar System',
            subject: 'Science',
            labAudience: 'all-levels',
            description: 'Explore the Sun and planets in 3D. Click each body to learn facts. Adjust time speed to see orbits.',
            learningObjective: 'Understand the structure of our solar system, the order of planets, and key facts about each (K-12 aligned).',
            component: SolarSystemLab,
        },
        {
            id: 'sci-sim-2',
            slug: 'earth-moon-system',
            title: 'Moon Phases & Eclipses',
            subject: 'Science',
            labAudience: 'middle-school',
            description: 'Explore the Earth–Moon–Sun system in 3D. Watch how the Moon’s orbit creates phases and why eclipses are rare.',
            learningObjective: 'Understand how relative positions of the Sun, Earth, and Moon create moon phases and why lunar/solar eclipses do not happen every month.',
            component: EarthMoonSystemLab,
        },

        // Chemistry Labs
        { 
            id: 'chem-lab-1', 
            slug: 'ammonia-test', 
            title: 'Test for Ammonia Gas', 
            subject: 'Chemistry', 
            labAudience: 'high-school',
            description: 'Identify ammonia gas using moist red litmus paper.', 
            learningObjective: 'Learn to identify basic gases through their chemical properties and indicator reactions.',
            component: AmmoniaTestLab 
        },
        { 
            id: 'chem-lab-2', 
            slug: 'hydrogen-pop-test', 
            title: 'Hydrogen "Pop" Test', 
            subject: 'Chemistry', 
            labAudience: 'middle-school',
            description: "Confirm the presence of hydrogen gas with its characteristic 'pop' sound.", 
            learningObjective: 'Understand combustion reactions and how to safely identify hydrogen gas in the laboratory.',
            component: HydrogenPopTestLab 
        },
        { 
            id: 'chem-lab-3', 
            slug: 'oxygen-test', 
            title: 'Testing for Oxygen Gas', 
            subject: 'Chemistry', 
            labAudience: 'middle-school',
            description: 'Learn how to identify oxygen gas using the glowing splint test.', 
            learningObjective: 'Understand how oxygen supports combustion and master the glowing splint test for identifying oxygen.',
            component: OxygenTestLab 
        },
        { 
            id: 'chem-lab-4', 
            slug: 'limewater-test-for-co2', 
            title: 'Limewater Test for CO₂', 
            subject: 'Chemistry', 
            labAudience: 'middle-school',
            description: 'Test for carbon dioxide by observing its reaction with limewater.', 
            learningObjective: 'Discover how carbon dioxide reacts with calcium hydroxide to form an insoluble precipitate.',
            component: LimewaterTestLab 
        },
        { 
            id: 'chem-lab-5', 
            slug: 'litmus-test', 
            title: 'Litmus Test for Acids and Bases', 
            subject: 'Chemistry', 
            labAudience: 'middle-school',
            description: 'Use litmus paper to identify acidic and basic solutions.', 
            learningObjective: 'Master the use of pH indicators to classify substances as acidic, basic, or neutral.',
            component: LitmusTestLab 
        },
        { 
            id: 'chem-lab-6', 
            slug: 'neutralization-reaction', 
            title: 'Neutralization Reaction', 
            subject: 'Chemistry', 
            labAudience: 'high-school',
            description: 'Observe the reaction between an acid and a base.', 
            learningObjective: 'Understand how acids and bases react to produce salt and water, and measure pH changes.',
            component: NeutralizationReactionLabEnhanced 
        },
        { 
            id: 'chem-lab-7', 
            slug: 'rusting-of-iron', 
            title: 'Rusting of Iron', 
            subject: 'Chemistry', 
            labAudience: 'middle-school',
            description: 'Investigate the conditions required for iron to rust.', 
            learningObjective: 'Learn about oxidation reactions and the environmental conditions that accelerate corrosion.',
            component: RustingLab 
        },
        { 
            id: 'chem-lab-7a', 
            slug: 'acid-base-neutralization', 
            title: 'Acid-Base Neutralization', 
            subject: 'Chemistry', 
            labAudience: 'high-school',
            description: 'Master titration and learn about chemical neutralization through precise experimentation.', 
            learningObjective: 'Understand and perform acid-base titration accurately using pH indicators.',
            component: AcidBaseNeutralizationLab 
        },
        { 
            id: 'chem-lab-8', 
            slug: 'separation-techniques', 
            title: 'Separation Techniques', 
            subject: 'Chemistry', 
            labAudience: 'middle-school',
            description: 'Practice filtration, evaporation, and decantation.', 
            learningObjective: 'Master common laboratory techniques for separating mixtures based on physical properties.',
            component: SeparationTechniquesLab 
        },
        { 
            id: 'chem-lab-9', 
            slug: 'test-for-water', 
            title: 'Test for Water', 
            subject: 'Chemistry', 
            labAudience: 'middle-school',
            description: 'Use chemical tests to confirm the presence of water.', 
            learningObjective: 'Learn chemical methods to detect water using anhydrous copper sulfate and cobalt chloride.',
            component: WaterTestLab 
        },
        { 
            id: 'chem-lab-10', 
            slug: 'flame-test', 
            title: 'Flame Test', 
            subject: 'Chemistry', 
            labAudience: 'high-school',
            description: 'Identify metal ions by the color they produce in a flame.', 
            learningObjective: 'Understand how electrons emit characteristic wavelengths of light and use this for metal identification.',
            component: FlameTestLab 
        },
        { 
            id: 'chem-lab-11', 
            slug: 'metal-acid-reaction', 
            title: 'Metal-Acid Reaction', 
            subject: 'Chemistry', 
            labAudience: 'high-school',
            description: 'Compare the reactivity of different metals with acid.', 
            learningObjective: 'Explore the reactivity series of metals and predict reaction outcomes based on metal position.',
            component: MetalAcidReactionLab 
        },
    ]
};

export const FREE_VIRTUAL_LAB_SLUGS = [
    'maths-sets-venn',
    'art-color-theory-studio',
    'food-tests',
    'litmus-test',
    'simple-circuits',
    'magnetic-field-mapping',
    'solar-system',
    'earth-moon-system',
] as const;

/**
 * Get available virtual labs based on premium status
 * Free users: 1 lab per subject (3 total) - Try before you buy
 * Premium users: All labs unlocked (20+ labs)
 */
export const getAllVirtualLabs = (userId: string = 'guest'): VirtualLabExperiment[] => {
    const allLabs = virtualLabExperiments.experiments;
    
    // Check virtual lab access (Virtual Lab subscription or Full Bundle)
    let hasAccess = false;
    if (typeof window !== 'undefined') {
        try {
            const { hasVirtualLabAccess } = require('./monetization');
            hasAccess = hasVirtualLabAccess(userId);
        } catch (e) {
            // Fallback for server-side rendering
            console.warn("Could not determine virtual lab access:", e);
        }
    }
    
    // Users with Virtual Lab subscription or Full Bundle get all labs
    if (hasAccess) {
        return allLabs as VirtualLabExperiment[];
    }
    
    // Free users: Get 1 lab per subject (Biology, Chemistry, Physics) + selected showcase labs
    // Food Tests (Biology), Litmus Test (Chemistry), Simple Circuits (Physics)
    // Magnetic Field Mapping (Physics - for testing/development)
    // Solar System & Earth–Moon System (Science – flagship 3D simulations, free to try)
    const freeLabs = allLabs.filter((lab) => FREE_VIRTUAL_LAB_SLUGS.includes(lab.slug as typeof FREE_VIRTUAL_LAB_SLUGS[number]));
    return freeLabs as VirtualLabExperiment[];
};

export const getVirtualLabBySlug = (slug: string, userId: string = 'guest'): VirtualLabExperiment | undefined => {
    const experiment = virtualLabExperiments.experiments.find(exp => exp.slug === slug);
    if (!experiment) {
        console.log(`[Virtual Labs] Lab not found: ${slug}`);
        return undefined;
    }
    
    // Ensure the subject matches the expected union type
    const validSubjects: Array<'Biology' | 'Chemistry' | 'Physics' | 'Science' | 'Mathematics' | 'Art'> = ['Biology', 'Chemistry', 'Physics', 'Science', 'Mathematics', 'Art'];
    if (!validSubjects.includes(experiment.subject as any)) {
        console.warn(`[Virtual Labs] Invalid subject for ${slug}: ${experiment.subject}`);
        return undefined;
    }
    
    // Check virtual lab access (Virtual Lab subscription or Full Bundle)
    let hasAccess = false;
    if (typeof window !== 'undefined') {
        try {
            const { hasVirtualLabAccess } = require('./monetization');
            hasAccess = hasVirtualLabAccess(userId);
            console.log(`[Virtual Labs] Access check for ${slug}: hasAccess=${hasAccess}, userId=${userId}`);
        } catch (e) {
            console.warn("[Virtual Labs] Could not determine virtual lab access:", e);
        }
    }
    
    // Free labs are always accessible (food-tests, litmus-test, simple-circuits, magnetic-field-mapping, solar-system, earth-moon-system)
    const isFree = FREE_VIRTUAL_LAB_SLUGS.includes(slug as typeof FREE_VIRTUAL_LAB_SLUGS[number]);
    
    console.log(`[Virtual Labs] ${slug} - isFree=${isFree}, hasAccess=${hasAccess}, allowing=${hasAccess || isFree}`);
    
    // Allow access if: 1) User has subscription, or 2) It's a free lab
    if (!hasAccess && !isFree) {
        console.warn(`[Virtual Labs] Access denied for ${slug} - no subscription and not a free lab`);
        return undefined; // Lab not available for this user
    }
    
    console.log(`[Virtual Labs] Granting access to ${slug}`);
    return experiment as VirtualLabExperiment;
};
