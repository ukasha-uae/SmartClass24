// {{level:shs:1}} Hardware & Networking (ICT) Lessons - NaCCA Standards-Based Curriculum
// Comprehensive lesson content for Computer Hardware Components and Networking

import type { Lesson } from '@/lib/types';

export const hardwareNetworkingSHS1Lessons: Lesson[] = [
  // Lesson 1: Computer Hardware Components
  {
    id: 'ict-shs1-hw-1',
    slug: 'ict-hardware-components',
    title: 'Computer Hardware Components',
    objectives: [
      'Define computer hardware and distinguish it from software',
      'Identify and describe the main components of a computer system',
      'Explain the function of the Central Processing Unit (CPU) and its parts',
      'Differentiate between RAM and ROM and explain their roles',
      'Compare different types of storage devices (HDD, SSD, USB drives)',
      'Classify and describe input and output devices with examples',
      'Understand the role of the motherboard as the central hub',
      'Identify components inside a system unit (power supply, expansion slots)',
      'Explain how hardware components work together to process data',
      'Apply knowledge to make informed decisions when buying or upgrading computers'
    ],
    introduction: "Welcome to the world inside your computer! Every day, you interact with computers—at school, at the internet café, or on your smartphone. But have you ever wondered what makes these machines work? Today, we'll open up the computer and explore its amazing components. From the powerful brain (CPU) to the memory banks (RAM), from the storage warehouses (Hard Drives) to the communication ports (Input/Output devices)—you'll understand how all these parts work together like a well-coordinated team. This knowledge will help you troubleshoot problems, make smart buying decisions, and even pursue careers in IT. Let's discover what makes your computer tick!",
    keyConcepts: [
      {
        title: 'What is Computer Hardware?',
        content: `Computer hardware refers to all the physical, tangible components of a computer system—the parts you can see and touch. Unlike software (programs and data), hardware is the actual machinery that makes computing possible.

**Hardware vs Software:**
- 🔧 **Hardware**: Physical components you can touch—keyboard, monitor, CPU, RAM, mouse
- 💿 **Software**: Programs and instructions that tell hardware what to do—Windows, Microsoft Word, WhatsApp

**Analogy**: Think of it like a human body:
- Hardware = Your body (brain, heart, hands, eyes)
- Software = Your thoughts, knowledge, and skills

**Main Categories of Hardware:**
1. **System Unit**: The main box containing the CPU, RAM, motherboard, storage
2. **Input Devices**: Send data INTO the computer (keyboard, mouse, microphone)
3. **Output Devices**: Get data OUT of the computer (monitor, printer, speakers)
4. **Storage Devices**: Keep data permanently (hard drive, SSD, USB flash drive)
5. **Communication Devices**: Connect to networks (modem, network card, Wi-Fi adapter)

**🎯 Local Context**: When you visit {{city:capital}}'s Computer Village (Circle) or {{figure:independence}} Circle, you'll see vendors selling different hardware components. Understanding what each part does helps you make smart purchases and avoid being overcharged!

**Quick Check**: Look at your classroom computer or phone. Can you identify which parts are hardware and which features are software?`
      },
      {
        title: 'The Central Processing Unit (CPU)',
        content: `The CPU (Central Processing Unit) is the "brain" of the computer. It processes all instructions and performs calculations. When you open an app, type a document, or play a game, the CPU is working behind the scenes.

**What Does the CPU Do?**
- 🧠 Executes program instructions one by one
- ➕ Performs arithmetic operations (addition, subtraction, multiplication, division)
- 🔀 Makes logical decisions (comparing values, checking conditions)
- 🎮 Controls all other hardware components

**Parts of the CPU:**
1. **ALU (Arithmetic Logic Unit)**
   - Performs all mathematical calculations
   - Handles logical operations (AND, OR, NOT)
   - Example: Calculating your exam average, comparing two numbers

2. **CU (Control Unit)**
   - The "traffic police" of the computer
   - Fetches instructions from memory
   - Decodes and executes instructions
   - Coordinates all computer operations

3. **Registers**
   - Tiny, super-fast memory inside the CPU
   - Temporarily stores data being processed
   - Types: Accumulator, Program Counter, Memory Address Register

**CPU Performance Factors:**
- ⚡ **Clock Speed**: Measured in GHz (billions of cycles per second)
  - A 3.0 GHz CPU performs 3 billion operations per second!
- 🔢 **Number of Cores**: Multi-core = Multiple CPUs in one chip
  - Dual-core (2), Quad-core (4), Octa-core (8)
  - More cores = Better multitasking
- 💾 **Cache Memory**: Small, fast memory on the CPU chip
  - L1, L2, L3 cache levels
  - Stores frequently used data for quick access

**Popular CPU Manufacturers:**
- **Intel**: Core i3, i5, i7, i9 series (found in many laptops/desktops)
- **AMD**: Ryzen 3, 5, 7, 9 series (competitive alternative)
- **Apple**: M1, M2, M3 chips (MacBooks and iMacs)
- **ARM**: Used in most smartphones including those sold in {{country}}

**🇬🇭 {{country}} Context**: When buying a laptop at {{city:capital}} Mall or from vendors at Circle, always check the CPU specifications. An Intel Core i5 or AMD Ryzen 5 is good for students. For gaming or video editing, you'd need i7/Ryzen 7 or higher.

**Cooling Systems:**
CPUs generate a lot of heat! They need:
- 🌀 **Heatsinks**: Metal plates that absorb and dissipate heat
- 💨 **Fans**: Blow cool air over the heatsink
- 💧 **Liquid Cooling**: For high-performance computers (uses water tubes)
- 🔥 **Thermal Paste**: Conducts heat between CPU and heatsink`
      },
      {
        title: 'Memory: RAM vs ROM',
        content: `Computer memory stores data and instructions. There are two main types: RAM (temporary, working memory) and ROM (permanent, startup memory). Understanding the difference is crucial!

**RAM (Random Access Memory):**
- 📝 **Type**: Volatile (loses data when power is off)
- 🎯 **Purpose**: Holds programs and data currently in use
- ⚡ **Speed**: Very fast—CPU accesses it directly
- 🔄 **Read/Write**: Can both read and write data
- 📊 **Analogy**: Like your desk—holds what you're currently working on

**How RAM Works:**
When you open WhatsApp on your phone:
1. The app is copied from storage to RAM
2. CPU accesses it quickly from RAM
3. When you close it, RAM is freed for other apps
4. When you turn off the phone, RAM is emptied

**RAM Sizes (Common in {{country}} market):**
- 4GB: Basic tasks (browsing, documents)
- 8GB: Good for students (multiple apps, light editing)
- 16GB: Professional work (video editing, programming)
- 32GB+: Gaming, 3D design, servers

**ROM (Read-Only Memory):**
- 📖 **Type**: Non-volatile (keeps data without power)
- 🎯 **Purpose**: Stores startup instructions (BIOS/UEFI)
- 🔒 **Modification**: Cannot be easily changed
- 📊 **Analogy**: Like a recipe book—permanent instructions

**Types of ROM:**
- **PROM**: Programmable ROM—can be written once
- **EPROM**: Erasable PROM—can be erased with UV light
- **EEPROM**: Electrically Erasable—can be updated (modern BIOS)

**RAM vs ROM Comparison:**

| Feature | RAM | ROM |
|---------|-----|-----|
| Volatility | Volatile | Non-volatile |
| Speed | Very Fast | Slower |
| Read/Write | Both | Read only |
| Contents | User data, programs | BIOS, firmware |
| Size | GB (8-64GB) | MB (few megabytes) |
| Cost | More expensive | Less expensive |

**Cache Memory:**
- Ultra-fast memory between CPU and RAM
- Stores frequently accessed data
- L1 (smallest, fastest) → L2 → L3 (largest, slower)
- Makes your computer feel snappier!

**🎯 Practical Tip**: If your computer is slow when you have many programs open, you likely need more RAM. In {{country}}, upgrading RAM is one of the most cost-effective ways to speed up an old laptop—check with technicians at Circle or Makola!`
      },
      {
        title: 'Storage Devices',
        content: `Storage devices keep your data permanently, even when the computer is turned off. They're like your digital library or warehouse—storing everything from your photos to your school projects.

**Why Storage Matters:**
- 📚 Keeps your files safe when power is off
- 📱 Stores the operating system (Windows, Android)
- 💾 Saves documents, photos, videos, music
- 🎮 Holds games and applications

**Types of Storage:**

**1. Hard Disk Drive (HDD)**
- 🔄 Uses spinning magnetic disks
- 💰 Affordable—good cost per GB
- 📊 Typical sizes: 500GB, 1TB, 2TB
- ⚠️ Slower, can be damaged by drops
- 🔊 Makes a slight humming sound
- Best for: Storing large files (movies, backups)

**2. Solid State Drive (SSD)**
- ⚡ No moving parts—uses flash memory
- 🚀 Much faster than HDD (boots Windows in seconds!)
- 🔇 Silent operation
- 💪 More durable—survives drops better
- 💸 More expensive per GB
- Typical sizes: 128GB, 256GB, 512GB, 1TB
- Best for: Operating system, frequently used programs

**3. USB Flash Drive (Pen Drive)**
- 📁 Portable, pocket-sized storage
- 🔌 Plugs into USB port
- 📊 Sizes: 4GB to 256GB+
- 💰 Very affordable in {{country}} markets
- Best for: Transferring files, backup

**4. Memory Cards (SD, microSD)**
- 📸 Used in phones, cameras, tablets
- 📊 Sizes: 16GB to 1TB
- Best for: Smartphones, cameras, portable devices

**5. Optical Drives (CD/DVD/Blu-ray)**
- 💿 Uses laser to read/write data
- CD: 700MB | DVD: 4.7GB | Blu-ray: 25GB+
- Becoming less common (many laptops don't have them)

**6. Cloud Storage**
- ☁️ Store files on internet servers
- 📱 Access from anywhere with internet
- Examples: Google Drive, Dropbox, OneDrive
- Popular in {{country}} for backing up photos

**Storage Capacity Units:**
- 1 Kilobyte (KB) = 1,024 bytes
- 1 Megabyte (MB) = 1,024 KB (a photo)
- 1 Gigabyte (GB) = 1,024 MB (hundreds of photos)
- 1 Terabyte (TB) = 1,024 GB (thousands of videos)

**HDD vs SSD Comparison:**

| Feature | HDD | SSD |
|---------|-----|-----|
| Speed | Slow (100-200 MB/s) | Fast (500-7000 MB/s) |
| Durability | Fragile | Durable |
| Noise | Audible | Silent |
| Heat | Warmer | Cooler |
| Price/GB | Cheaper | More expensive |
| Lifespan | 3-5 years | 5-10 years |

**🇬🇭 Buying Tips in {{country}}:**
- Check Jumia or Telefonika for prices
- At Computer Village (Circle), compare prices between shops
- Always buy from reputable sellers—fake storage devices are common!
- A 256GB SSD + 1TB HDD combo is a popular choice for new computers`
      },
      {
        title: 'Input Devices',
        content: `Input devices send data INTO the computer. They convert human actions (typing, clicking, speaking) into signals the computer can understand and process.

**Common Input Devices:**

**1. Keyboard**
- ⌨️ Main device for entering text and commands
- Types: Standard (QWERTY), Ergonomic, Mechanical, Membrane
- Keys: Alphanumeric, Function (F1-F12), Navigation, Modifier (Ctrl, Alt, Shift)
- Connection: USB, Wireless (Bluetooth/RF)

**2. Mouse**
- 🖱️ Points, clicks, and navigates on screen
- Types: Optical, Laser, Trackball, Wireless
- Actions: Click, Double-click, Right-click, Drag, Scroll
- Alternatives: Touchpad (laptops), Trackpoint

**3. Touchscreen**
- 👆 Input directly on the display
- Found in: Smartphones, Tablets, ATMs, POS machines
- Technologies: Capacitive (uses finger's electrical charge), Resistive (pressure-based)
- Common in {{country}}: MTN MoMo kiosks, bank ATMs

**4. Microphone**
- 🎤 Converts sound to digital signals
- Uses: Voice calls, recording, voice commands
- Types: Built-in (laptops/phones), External, USB microphones
- Examples: Google Assistant, Siri, recording voice notes

**5. Scanner**
- 📄 Converts physical documents to digital images
- Types: Flatbed, Sheet-fed, Handheld, Barcode
- Uses: Digitizing documents, OCR (text recognition)
- Common in {{country}}: Banks, photocopy shops, GRA offices

**6. Webcam/Camera**
- 📸 Captures images and video
- Built into laptops and phones
- Uses: Video calls, photos, security, document scanning
- Popular apps: Zoom, Google Meet, WhatsApp video calls

**7. Biometric Devices**
- 👆 Fingerprint scanners (phones, laptops, National ID)
- 👁️ Iris/Retina scanners (high security)
- 🗣️ Voice recognition
- Used in {{country}}: {{country}} Card registration, bank verification

**8. Game Controllers**
- 🎮 Joysticks, gamepads, steering wheels
- Motion sensors: Wii Remote, PlayStation Move

**9. Other Input Devices:**
- 📊 Barcode readers (supermarkets, shops)
- 🏧 Card readers (ATMs, POS machines)
- 📡 Sensors (temperature, motion, light)
- 🖊️ Graphics tablets (for digital art)
- 🎵 MIDI controllers (music production)

**How Input Devices Work (Keyboard Example):**
1. You press the 'A' key
2. A circuit is completed under that key
3. A unique code (scan code) is generated
4. The code is sent to the CPU via cable/wireless
5. CPU interprets the code and displays 'A' on screen

**🇬🇭 {{country}} Context:**
- Keyboards with International characters are common
- Barcode scanners are used in Shoprite, Melcom
- Fingerprint scanners are essential for {{country}} Card
- Mobile phone touchscreens are the most used input devices!

**Practice Activity:**
Count and list all the input devices you can find in your:
1. School computer lab
2. Internet café
3. Your home`
      },
      {
        title: 'Output Devices',
        content: `Output devices present information FROM the computer to the user. They convert digital data into forms humans can understand—text, images, sound, or physical prints.

**Common Output Devices:**

**1. Monitor/Display Screen**
- 🖥️ Primary visual output device
- **Types:**
  - LCD (Liquid Crystal Display): Most common
  - LED (Light Emitting Diode): Brighter, energy-efficient
  - OLED: Best colors, found in premium phones
  - CRT (Cathode Ray Tube): Old, bulky (rarely used now)
  
- **Key Specifications:**
  - Resolution: HD (1280x720), Full HD (1920x1080), 4K (3840x2160)
  - Size: Measured diagonally in inches (15", 24", 27")
  - Refresh Rate: 60Hz, 144Hz, 240Hz (higher = smoother)
  - Response Time: Important for gaming

**2. Printer**
- 🖨️ Produces physical copies (hardcopy) of documents
- **Types:**
  - **Inkjet**: Uses liquid ink, good for photos, affordable
  - **Laser**: Uses toner powder, fast, good for text documents
  - **Dot Matrix**: Impact printer, uses ribbon, for receipts
  - **Thermal**: Uses heat, for receipts at shops
  - **3D Printer**: Creates physical objects layer by layer!

- **Printer Terms:**
  - DPI (Dots Per Inch): Higher = sharper prints
  - PPM (Pages Per Minute): Speed of printing

**3. Speakers & Headphones**
- 🔊 Convert digital signals to sound
- Types: Built-in, External, Surround sound, Bluetooth
- Uses: Music, videos, alerts, voice calls, gaming
- Quality measured in: Watts, Frequency response

**4. Projector**
- 📽️ Displays images on large screens/walls
- Used in: Classrooms, churches, conference rooms
- Types: LCD, DLP, LED
- Measured in: Lumens (brightness)
- Common in {{country}}: Schools, churches, event centers

**5. Plotter**
- 📐 Specialized printer for large technical drawings
- Used by: Architects, engineers, surveyors
- Creates: Maps, building plans, posters

**Hardcopy vs Softcopy:**
- **Hardcopy**: Physical, printed output (paper documents)
- **Softcopy**: Digital output displayed on screen (files)

**Output Device Applications:**

| Device | What It Produces | Common Use in {{country}} |
|--------|------------------|---------------------|
| Monitor | Visual display | Computers, TVs |
| Printer | Paper documents | Offices, schools |
| Speaker | Audio/Sound | Music, calls |
| Projector | Large images | Churches, schools |
| Headphones | Personal audio | Phones, computers |

**How Monitors Work (LCD Example):**
1. GPU processes image data
2. Sends signals to monitor
3. Liquid crystals twist/untwist
4. Backlight shines through
5. Colored pixels form the image
6. You see the picture!

**🇬🇭 Buying Guide for {{country}}:**
- **Monitors**: 24" Full HD is good for most users
- **Printers**: Inkjet for home, Laser for offices
- Consider ink/toner costs (often more than the printer!)
- Check warranty and service centers in {{country}}

**Output Scenarios:**
- Typing a document → Monitor displays it
- Printing homework → Printer produces hardcopy
- Playing music → Speakers/headphones output sound
- Presenting slides → Projector shows on wall`
      },
      {
        title: 'The Motherboard',
        content: `The motherboard is the main circuit board of a computer—it's like the central nervous system that connects all components together. Every part of your computer either plugs into or communicates through the motherboard.

**What Does the Motherboard Do?**
- 🔌 Provides connections for all hardware components
- ⚡ Distributes power from PSU to components
- 🔄 Enables communication between CPU, RAM, storage, etc.
- 📊 Houses important chips and controllers

**Key Motherboard Components:**

**1. CPU Socket**
- 🧠 Where the processor (CPU) is installed
- Different sockets for Intel (LGA) vs AMD (AM4, AM5)
- IMPORTANT: CPU and socket must match!

**2. RAM Slots (DIMM)**
- 💾 Slots where memory sticks are inserted
- Usually 2-4 slots
- Labeled: DIMM_A1, DIMM_B1, etc.
- Different types: DDR4, DDR5 (must match RAM type)

**3. Expansion Slots**
- **PCIe Slots**: For graphics cards, sound cards, etc.
  - PCIe x16: For graphics cards
  - PCIe x1: For smaller expansion cards
- **M.2 Slots**: For fast NVMe SSDs

**4. SATA Connectors**
- 💿 Connect hard drives and SSDs
- Usually 4-6 ports on modern motherboards
- Data cable (thin) + Power cable (from PSU)

**5. Power Connectors**
- ⚡ 24-pin ATX: Main motherboard power
- 4/8-pin CPU: Extra power for processor

**6. BIOS/UEFI Chip**
- 🔧 Stores startup firmware
- Configures hardware before Windows loads
- Can update (flash) for new features

**7. I/O Panel (Back Panel)**
- 🔌 External connection ports:
  - USB ports (2.0, 3.0, Type-C)
  - Audio jacks (headphones, microphone)
  - Video outputs (HDMI, DisplayPort)
  - Ethernet (network) port
  - PS/2 ports (older keyboards/mice)

**8. Chipset**
- 🎛️ Controls communication between components
- Intel: Z790, B760 (higher number = more features)
- AMD: X670, B650

**9. CMOS Battery**
- 🔋 Small battery (CR2032)
- Keeps BIOS settings and clock running
- Lasts 3-5 years
- If your computer loses date/time, this might need replacing

**Motherboard Sizes (Form Factors):**
- **ATX**: Full-size, most features, for desktops
- **Micro-ATX (mATX)**: Smaller, fewer expansion slots
- **Mini-ITX**: Smallest, for compact builds
- Case and motherboard size must match!

**🔧 Troubleshooting Tip:**
If your computer won't start:
1. Check if power cable is connected
2. Ensure RAM is properly seated
3. Listen for beep codes (motherboard tells you what's wrong!)
4. Check the CMOS battery if date/time reset

**🇬🇭 Local Knowledge:**
- When upgrading, ensure compatibility (CPU socket, RAM type)
- Technicians at Circle/Makola can help with motherboard issues
- Always handle motherboards carefully—static electricity can damage them!
- Ground yourself before touching internal components`
      },
      {
        title: 'Power Supply Unit & System Case',
        content: `The Power Supply Unit (PSU) converts electricity from your wall outlet into the right type of power for each computer component. The System Case (chassis) houses and protects all the hardware.

**Power Supply Unit (PSU):**

**What Does the PSU Do?**
- ⚡ Converts AC (alternating current) from wall to DC (direct current)
- 🔌 Provides different voltages: +3.3V, +5V, +12V
- 🛡️ Protects components from power surges
- 🌡️ Has a cooling fan for itself

**PSU Specifications:**
- **Wattage**: Total power output (400W, 500W, 650W, 750W+)
  - Basic computer: 400-500W
  - Gaming PC: 650-850W
  - High-end workstation: 850W+

- **Efficiency Rating (80 Plus):**
  - 80 Plus (White): 80% efficient
  - 80 Plus Bronze: 82-85% efficient
  - 80 Plus {{resource:mineral}}: 87-90% efficient
  - 80 Plus Platinum: 90-94% efficient
  - Higher efficiency = Less electricity wasted as heat = Lower bills!

**PSU Connectors:**
- 24-pin ATX: Main motherboard power
- 4+4 pin CPU: Processor power
- 6+2 pin PCIe: Graphics card power
- SATA: For storage drives
- Molex: For older devices, fans

**PSU Types:**
- **Non-Modular**: All cables permanently attached
- **Semi-Modular**: Main cables fixed, extras detachable
- **Fully Modular**: All cables detachable (cleanest build)

**⚠️ Power Considerations in {{country}}:**
- {{country}} uses 230V AC power
- Power fluctuations are common—use a voltage stabilizer!
- Power surge protector is essential
- UPS (Uninterruptible Power Supply) recommended for:
  - Preventing data loss during 'lights off'
  - Protecting against sudden power cuts
  - Giving you time to save work and shut down properly

**System Case (Chassis):**

**What Does the Case Do?**
- 🏠 Houses all internal components
- 🛡️ Protects hardware from dust, damage
- 🌡️ Aids airflow and cooling
- 🔌 Provides front panel ports and buttons

**Case Sizes:**
- **Full Tower**: Largest, most expansion room, for enthusiasts
- **Mid Tower**: Most common, good balance of size and features
- **Mini Tower/SFF**: Compact, limited expansion
- **Desktop (Horizontal)**: Lies flat, monitor sits on top

**Case Features:**
- Front panel: Power button, USB ports, audio jacks
- Drive bays: For HDD, SSD, optical drives
- Expansion slots: Align with motherboard PCIe slots
- Cable management: Holes and straps for tidy wiring
- Fans/ventilation: Intake (front), Exhaust (back)

**Good Airflow Pattern:**
- Cool air IN from front/bottom
- Hot air OUT from back/top
- Heat rises—use this natural physics!

**🇬🇭 Practical Tips:**
- In dusty environments, clean your case regularly
- Dust filters help, but clean them monthly
- Don't block ventilation holes
- Keep computer off the floor to reduce dust intake
- Consider a UPS from Electroland, Telefonika, or IT shops at Circle`
      },
      {
        title: 'How Hardware Components Work Together',
        content: `A computer is like a well-organized team where each hardware component has a specific role. Let's trace what happens when you do something simple—like opening WhatsApp on a computer.

**The Process: Opening WhatsApp Web**

**Step 1: Input**
- You move the mouse (input device)
- Mouse sensor detects movement
- Sends signal through USB to motherboard
- Motherboard relays to CPU

**Step 2: Processing**
- CPU receives mouse position data
- Updates cursor position on screen
- When you click, CPU registers the action
- Identifies what you clicked (WhatsApp icon)

**Step 3: Storage to Memory**
- CPU instructs storage (SSD/HDD) to find WhatsApp
- Program files are copied from storage to RAM
- RAM holds the program for fast access

**Step 4: Execution**
- CPU fetches instructions from RAM
- ALU performs calculations
- Control Unit coordinates operations
- GPU processes visual elements

**Step 5: Output**
- GPU sends display data to monitor
- You see WhatsApp interface
- Speakers play notification sounds

**The Bus System:**
Think of buses as highways for data:
- **Data Bus**: Carries actual data between components
- **Address Bus**: Carries memory addresses
- **Control Bus**: Carries command signals

**Component Communication Chart:**

\`\`\`
    [Input Devices] → [CPU] → [Output Devices]
           ↑            ↕            ↓
           └─── [RAM] ←→ [Storage] ──┘
                   ↕
            [Motherboard]
                   ↕
               [PSU Power]
\`\`\`

**Real-Time Example: Playing a Video**

1. **Double-click video file** (Mouse → CPU)
2. **CPU checks file type** (CPU → RAM)
3. **Loads video player** (Storage → RAM → CPU)
4. **Reads video data** (Storage → RAM)
5. **Decodes video** (CPU/GPU processing)
6. **Displays frames** (GPU → Monitor)
7. **Plays audio** (CPU → Sound Card → Speakers)
8. **User controls** (Keyboard/Mouse → CPU)

**Speed Hierarchy (Fastest to Slowest):**
1. CPU Registers (fastest)
2. L1 Cache
3. L2 Cache
4. L3 Cache
5. RAM
6. SSD
7. HDD (slowest)

**Why This Matters:**
- Data should be in fastest memory when being used
- That's why opening a program is slow (loading from storage)
- But using it is fast (already in RAM)

**Bottlenecks:**
- If one component is slow, it slows everything down
- Common bottlenecks:
  - Old HDD with new CPU = Slow loading
  - Little RAM with many programs = Freezing
  - Slow GPU with gaming = Low frame rates

**🎯 Optimization Tips:**
- Upgrade to SSD for faster loading
- Add more RAM for better multitasking
- Clean dust from fans for better cooling
- Close unused programs to free RAM`
      },
      {
        title: 'Buying and Upgrading Computers',
        content: `Now that you understand hardware components, you can make smart decisions when buying or upgrading computers. This is valuable knowledge for your personal use and potentially for advising others!

**Buying a New Computer:**

**Questions to Ask Yourself:**
1. What will I use it for? (School work, gaming, video editing?)
2. Desktop or Laptop? (Portability vs Power)
3. What's my budget?

**Recommended Specs by Use Case:**

**📚 Student/Office Work:**
- CPU: Intel Core i3/i5 or AMD Ryzen 3/5
- RAM: 8GB
- Storage: 256GB SSD
- Graphics: Integrated (Intel UHD/AMD Vega)
- Price Range: GH{{currency}}2,000 - 4,000

**🎮 Gaming/Content Creation:**
- CPU: Intel Core i5/i7 or AMD Ryzen 5/7
- RAM: 16GB
- Storage: 512GB SSD + 1TB HDD
- Graphics: NVIDIA GTX 1650/RTX 3060 or AMD RX 6600
- Price Range: GH{{currency}}5,000 - 12,000+

**💼 Professional/Heavy Work:**
- CPU: Intel Core i7/i9 or AMD Ryzen 7/9
- RAM: 32GB+
- Storage: 1TB+ NVMe SSD
- Graphics: NVIDIA RTX 3080/4070+
- Price Range: GH{{currency}}10,000 - 25,000+

**Where to Buy in {{country}}:**
- **Official Stores**: Telefonika, Electroland, Franko Trading
- **Online**: Jumia {{country}}, Tonaton, Jiji {{country}}
- **Markets**: Computer Village (Circle), Makola
- **Tips**: Compare prices, ask for warranty, test before buying

**Upgrading Your Current Computer:**

**Best Upgrade Investments:**

1. **HDD to SSD** (Biggest impact!)
   - Most noticeable improvement
   - Computer boots in seconds
   - Programs open instantly
   - Cost: GH{{currency}}200-500 for 256GB

2. **Add More RAM**
   - Better multitasking
   - Less freezing with many tabs
   - Check motherboard max supported
   - Cost: GH{{currency}}150-400 for 8GB

3. **Clean Dust & Replace Thermal Paste**
   - Improves cooling
   - Reduces noise
   - Can boost performance
   - Cost: GH{{currency}}20-50 for paste

4. **Graphics Card Upgrade** (for gaming)
   - Better gaming performance
   - Check PSU wattage first!
   - Cost: GH{{currency}}1,000-5,000+

**Upgrade Compatibility Checklist:**
- ✅ RAM: DDR4 or DDR5? Check motherboard
- ✅ SSD: SATA or NVMe? Check available slots
- ✅ GPU: PCIe slot available? PSU powerful enough?
- ✅ CPU: Same socket type as motherboard?

**⚠️ What to Avoid:**
- Don't buy the cheapest option (quality matters!)
- Don't ignore warranty
- Don't forget about accessories (charger, bag, etc.)
- Don't buy from untrusted sellers
- Don't open computer without proper tools/knowledge

**🇬🇭 {{country}}-Specific Considerations:**
- **Power Issues**: Always budget for UPS/stabilizer
- **Dust**: {{country}} is dusty—clean your PC regularly
- **Heat**: Ensure good ventilation, avoid blocking fans
- **Service**: Buy from shops with local service centers
- **Warranty**: Get proper receipts for warranty claims

**Smart Shopping Checklist:**
- [ ] Determined my use case and budget
- [ ] Researched specs I need
- [ ] Compared prices at multiple stores
- [ ] Checked for warranty and support
- [ ] Tested the device before paying
- [ ] Got proper receipt/invoice
- [ ] Bought necessary accessories (case, charger)
- [ ] Budgeted for UPS/surge protector`
      }
    ],
    activities: {
      type: 'shortanswer',
      questions: [
        {
          question: 'Open a computer system unit (with supervision) and identify all major components. Create a labeled diagram of everything you find inside.',
          sampleAnswer: 'Components found inside: 1. CPU (processor with heatsink and fan), 2. RAM sticks in DIMM slots, 3. Motherboard with various slots and connectors, 4. Power Supply Unit (PSU), 5. Storage drives (HDD/SSD), 6. SATA cables connecting storage, 7. PCIe slots for expansion cards, 8. CMOS battery on motherboard, 9. Front panel connectors, 10. Case fans for cooling.'
        },
        {
          question: 'Research and compare specifications of three different computers from Jumia {{country}}. Which one offers the best value for a student?',
          sampleAnswer: 'Comparison should include: CPU type (i3 vs i5 vs i7), RAM size (4GB vs 8GB vs 16GB), Storage type and size (HDD vs SSD), price in {{currency:name}}, and value analysis considering student needs (document editing, browsing, basic programming). Best value typically is mid-range with SSD and 8GB RAM.'
        },
        {
          question: 'Survey your school or home to list all input and output devices. Categorize them and explain their functions.',
          sampleAnswer: 'Input devices found: Keyboards (text entry), Mice/Touchpads (pointing), Webcams (video capture), Microphones (audio input), Scanners (document digitization). Output devices found: Monitors (visual display), Printers (hardcopy), Speakers (audio output), Projectors (large display). Some devices like touchscreens are both input and output.'
        },
        {
          question: 'Explain why upgrading from HDD to SSD is considered the best single upgrade for an old computer.',
          sampleAnswer: 'SSD upgrade benefits: 1. Boot time reduces from minutes to seconds, 2. Programs launch almost instantly, 3. No moving parts means more durability, 4. Silent operation, 5. Lower power consumption. The speed increase is immediately noticeable because storage is often the biggest bottleneck in older systems. Cost is relatively low (around GH{{currency}}300-500 for 256GB) compared to buying a new computer.'
        }
      ]
    },
    pastQuestions: [
      {
        year: '2023',
        question: 'State FOUR differences between RAM and ROM.',
        answer: '1. RAM is volatile (loses data when power off) while ROM is non-volatile (retains data). 2. RAM can be read and written while ROM is primarily read-only. 3. RAM stores active programs and data while ROM stores firmware/BIOS. 4. RAM is faster than ROM. 5. RAM has larger capacity (GB) while ROM is smaller (MB).'
      },
      {
        year: '2022',
        question: 'List and explain THREE functions of the Central Processing Unit (CPU).',
        answer: '1. Arithmetic operations: The ALU performs mathematical calculations like addition, subtraction, multiplication, and division. 2. Logical operations: The ALU makes comparisons and decisions (AND, OR, NOT operations). 3. Control operations: The Control Unit coordinates all computer activities, fetches instructions, decodes them, and controls the execution sequence.'
      },
      {
        year: '2021',
        question: 'Differentiate between input and output devices. Give TWO examples of each.',
        answer: 'Input devices send data INTO the computer for processing. Examples: Keyboard (enters text and commands), Mouse (points and clicks on screen), Scanner (digitizes documents), Microphone (records audio). Output devices present processed data FROM the computer to the user. Examples: Monitor (displays visual information), Printer (produces hardcopy documents), Speakers (output audio), Projector (displays on large screens).'
      },
      {
        year: '2020',
        question: 'Explain the function of the motherboard in a computer system.',
        answer: 'The motherboard is the main circuit board that connects all computer components. Its functions include: 1. Providing physical connections for CPU, RAM, storage, and expansion cards. 2. Distributing power from the PSU to all components. 3. Enabling communication between components through buses. 4. Housing the BIOS/UEFI chip for startup instructions. 5. Providing external connectivity through I/O ports.'
      },
      {
        year: '2019',
        question: 'State the differences between Hard Disk Drive (HDD) and Solid State Drive (SSD).',
        answer: '1. HDD uses spinning magnetic disks while SSD uses flash memory chips. 2. SSD is faster (500+ MB/s) compared to HDD (100-200 MB/s). 3. SSD has no moving parts, making it more durable than HDD. 4. SSD is silent while HDD makes audible noise. 5. HDD is cheaper per GB compared to SSD. 6. SSD consumes less power and generates less heat.'
      },
      {
        year: '2018',
        question: 'Describe the functions of the following CPU components: (a) ALU (b) Control Unit (c) Registers',
        answer: '(a) ALU (Arithmetic Logic Unit): Performs all mathematical calculations (addition, subtraction, multiplication, division) and logical operations (AND, OR, NOT, comparisons). (b) Control Unit: Acts as the coordinator of the CPU. It fetches instructions from memory, decodes them, and controls their execution. It directs the flow of data between CPU and other components. (c) Registers: Small, high-speed memory locations inside the CPU that temporarily store data being processed. Types include accumulator, program counter, and memory address register.'
      },
      {
        year: '2023',
        question: 'What factors should be considered when choosing a computer for school work?',
        answer: '1. Processor (CPU): Intel Core i3/i5 or AMD Ryzen 3/5 for good performance. 2. RAM: At least 8GB for multitasking with documents and browser tabs. 3. Storage: SSD preferred for faster loading (256GB minimum). 4. Portability: Laptop if needed to carry to school. 5. Battery life: Important for laptops. 6. Display quality: Good screen for reading. 7. Budget: Balance features with cost. 8. Warranty and support: Essential for repairs.'
      },
      {
        year: '2022',
        question: 'Explain the importance of the Power Supply Unit (PSU) in a computer system.',
        answer: 'The PSU converts AC power from the wall outlet to DC power needed by computer components. Its importance: 1. Provides correct voltages (+3.3V, +5V, +12V) for different components. 2. Protects hardware from power surges and fluctuations. 3. Supplies stable power for reliable operation. 4. Has cooling fan to prevent overheating. 5. Insufficient PSU wattage can cause system instability or damage.'
      }
    ],
    summary: `In this comprehensive lesson on Computer Hardware Components, we explored the physical parts that make up a computer system:

**Key Takeaways:**

🧠 **CPU (Central Processing Unit)**: The brain of the computer with ALU (calculations), Control Unit (coordination), and Registers (temporary storage). Performance measured in GHz and cores.

💾 **Memory Types**: RAM (volatile, fast, for active data) vs ROM (permanent, stores BIOS). More RAM = Better multitasking.

📦 **Storage Devices**: HDD (cheap, large, slow) vs SSD (fast, durable, expensive). Understanding capacity units (KB, MB, GB, TB).

⌨️ **Input Devices**: Send data to computer - Keyboard, Mouse, Scanner, Microphone, Touchscreen, Biometric devices.

🖥️ **Output Devices**: Present data to users - Monitor, Printer, Speakers, Projector.

🔌 **Motherboard**: Central hub connecting all components with CPU socket, RAM slots, expansion slots, and I/O ports.

⚡ **Power Supply Unit**: Converts AC to DC power, with efficiency ratings (80 Plus) and appropriate wattage crucial for stable operation.

**Practical Knowledge:**
- Use UPS in {{country}} to protect against 'lights off'
- SSD upgrade gives the biggest performance boost
- 8GB RAM minimum for modern use
- Always check compatibility when upgrading

Understanding hardware empowers you to troubleshoot problems, make smart purchases, and pursue ICT careers!`,
    endOfLessonQuiz: [
      {
        id: '1',
        type: 'mcq',
        question: 'Which component is known as the "brain" of the computer?',
        options: ['RAM', 'CPU', 'Hard Drive', 'Motherboard'],
        answer: 'CPU',
        explanation: 'The CPU (Central Processing Unit) is called the brain of the computer because it processes all instructions and performs calculations.'
      },
      {
        id: '2',
        type: 'mcq',
        question: 'What type of memory loses its contents when the computer is turned off?',
        options: ['ROM', 'Hard Disk', 'RAM', 'SSD'],
        answer: 'RAM',
        explanation: 'RAM (Random Access Memory) is volatile memory, meaning it requires power to maintain stored data. When power is removed, all data is lost.'
      },
      {
        id: '3',
        type: 'mcq',
        question: 'Which storage device has no moving parts?',
        options: ['Hard Disk Drive (HDD)', 'Solid State Drive (SSD)', 'CD-ROM', 'Floppy Disk'],
        answer: 'Solid State Drive (SSD)',
        explanation: 'SSDs use flash memory chips with no moving parts, making them faster, quieter, and more durable than HDDs which use spinning magnetic disks.'
      },
      {
        id: '4',
        type: 'mcq',
        question: 'The motherboard is also known as:',
        options: ['System board', 'CPU', 'RAM slot', 'Power supply'],
        answer: 'System board',
        explanation: 'The motherboard is also called the system board or main board. It is the primary circuit board that connects all computer components.'
      },
      {
        id: '5',
        type: 'mcq',
        question: 'Which part of the CPU performs mathematical calculations?',
        options: ['Control Unit', 'Registers', 'ALU', 'Cache'],
        answer: 'ALU',
        explanation: 'The ALU (Arithmetic Logic Unit) performs all mathematical operations (addition, subtraction, etc.) and logical comparisons in the CPU.'
      },
      {
        id: '6',
        type: 'mcq',
        question: 'A keyboard is an example of:',
        options: ['Output device', 'Input device', 'Storage device', 'Processing device'],
        answer: 'Input device',
        explanation: 'A keyboard is an input device because it sends data INTO the computer when you type.'
      },
      {
        id: '7',
        type: 'mcq',
        question: 'What does PSU stand for?',
        options: ['Primary System Unit', 'Power Supply Unit', 'Processing Speed Unit', 'Parallel Storage Unit'],
        answer: 'Power Supply Unit',
        explanation: 'PSU stands for Power Supply Unit. It converts AC power from the wall outlet to DC power for computer components.'
      },
      {
        id: '8',
        type: 'mcq',
        question: 'Which of these is NOT a function of ROM?',
        options: ['Store BIOS', 'Store startup instructions', 'Store currently running programs', 'Store firmware'],
        answer: 'Store currently running programs',
        explanation: 'ROM stores permanent data like BIOS and firmware. Currently running programs are stored in RAM, not ROM.'
      },
      {
        id: '9',
        type: 'mcq',
        question: 'How is CPU speed typically measured?',
        options: ['Megabytes (MB)', 'Gigahertz (GHz)', 'Watts (W)', 'Pixels'],
        answer: 'Gigahertz (GHz)',
        explanation: 'CPU speed is measured in Gigahertz (GHz), representing billions of clock cycles per second. Higher GHz generally means faster processing.'
      },
      {
        id: '10',
        type: 'mcq',
        question: 'Which device would you use to convert a paper document into a digital file?',
        options: ['Printer', 'Monitor', 'Scanner', 'Speaker'],
        answer: 'Scanner',
        explanation: 'A scanner is an input device that converts physical documents or images into digital files that can be stored and edited on a computer.'
      },
      {
        id: '11',
        type: 'mcq',
        question: 'What is the main advantage of SSD over HDD?',
        options: ['Lower cost per GB', 'Larger storage capacity', 'Faster data access speed', 'Uses magnetic storage'],
        answer: 'Faster data access speed',
        explanation: 'SSDs are significantly faster than HDDs (500+ MB/s vs 100-200 MB/s) because they use flash memory with no mechanical parts.'
      },
      {
        id: '12',
        type: 'mcq',
        question: 'The Control Unit of the CPU is responsible for:',
        options: ['Storing data permanently', 'Displaying output', 'Coordinating computer operations', 'Converting AC to DC'],
        answer: 'Coordinating computer operations',
        explanation: 'The Control Unit coordinates all computer operations by fetching instructions from memory, decoding them, and directing their execution.'
      },
      {
        id: '13',
        type: 'mcq',
        question: '1 Gigabyte (GB) equals:',
        options: ['1,000 KB', '1,024 MB', '1,000,000 bytes', '100 TB'],
        answer: '1,024 MB',
        explanation: '1 GB = 1,024 MB (megabytes). This follows the binary system: 1 KB = 1,024 bytes, 1 MB = 1,024 KB, 1 GB = 1,024 MB.'
      },
      {
        id: '14',
        type: 'mcq',
        question: 'Which efficiency rating indicates the highest quality power supply?',
        options: ['80 Plus', '80 Plus Bronze', '80 Plus {{resource:mineral}}', '80 Plus Platinum'],
        answer: '80 Plus Platinum',
        explanation: '80 Plus Platinum (90-94% efficiency) is higher than {{resource:mineral}} (87-90%), Bronze (82-85%), and basic 80 Plus (80%). Higher efficiency means less energy wasted as heat.'
      },
      {
        id: '15',
        type: 'mcq',
        question: 'What should you buy in {{country}} to protect your computer from sudden power cuts?',
        options: ['Extra RAM', 'Larger monitor', 'UPS (Uninterruptible Power Supply)', 'Faster SSD'],
        answer: 'UPS (Uninterruptible Power Supply)',
        explanation: 'A UPS provides backup battery power during outages, protecting your computer from sudden shutdowns and giving you time to save work and properly shut down.'
      }
    ]
  },
  // Lesson 2: Networking Fundamentals (Comprehensive)
  {
    id: 'ict-shs1-hw-2',
    slug: 'ict-networking-fundamentals',
    title: 'Networking Fundamentals',
    objectives: [
      'Define computer networking and explain its importance in modern communication',
      'Identify and differentiate types of networks (PAN, LAN, MAN, WAN)',
      'Explain network topologies (Bus, Star, Ring, Mesh, Hybrid) with advantages and disadvantages',
      'Describe the functions of networking devices (router, switch, hub, modem, access point)',
      'Understand the OSI and TCP/IP models and their layers',
      'Explain IP addressing (IPv4, IPv6) and subnet masks',
      'Describe wired (Ethernet, Fiber) and wireless (Wi-Fi, Bluetooth) technologies',
      'Understand network security concepts (firewalls, encryption, VPN)',
      'Apply networking concepts to troubleshoot common connectivity issues',
      'Relate networking to real-world applications in {{country}} (mobile money, e-learning)'
    ],
    introduction: "Welcome to the interconnected world of computer networks! Every time you send a WhatsApp message, make a mobile money transfer, browse social media, or stream music, you're using a network. Networks are the invisible highways that carry data between billions of devices worldwide. In this comprehensive lesson, we'll explore how networks work—from the physical cables and wireless signals that carry data, to the devices that direct traffic, to the protocols that ensure your message reaches exactly the right destination. Understanding networking is essential in our digital age, where connectivity powers everything from MTN Mobile Money to online learning platforms. Whether you want to become a network engineer, IT specialist, or simply understand how the digital world connects, this lesson is your gateway. Let's discover how it all connects!",
    keyConcepts: [
      {
        title: 'What is a Computer Network?',
        content: `A computer network is a collection of interconnected devices (computers, phones, printers, servers) that can communicate and share resources with each other. Networks have revolutionized how we work, learn, communicate, and conduct business.

**Why Networks Matter:**
- 📱 **Communication**: WhatsApp, email, video calls, social media
- 🌍 **Internet Access**: Browse websites, stream content, download files
- 🖨️ **Resource Sharing**: Share printers, storage, and software licenses
- 💰 **Financial Services**: Mobile money (MTN MoMo, Vodafone Cash), online banking
- 🏢 **Business Operations**: Connect branches, enable remote work
- 📚 **Education**: E-learning platforms, online research, digital libraries
- 🏥 **Healthcare**: Telemedicine, patient records, remote diagnostics

**Basic Network Components:**
1. **End Devices (Hosts)**: Computers, smartphones, tablets, printers, servers—devices that send or receive data
2. **Network Devices (Intermediary)**: Routers, switches, hubs, modems—devices that forward data
3. **Network Media**: Physical cables (Ethernet, fiber optic) or wireless signals (Wi-Fi, Bluetooth)
4. **Network Protocols**: Rules and standards for communication (TCP/IP, HTTP, HTTPS)
5. **Network Services**: DNS, DHCP, email servers, web servers

**Real-World Analogy:**
Think of a network like {{country}}'s road system:
- **End Devices** = Houses, offices, shops (origins and destinations)
- **Network Devices** = Intersections, traffic lights, roundabouts (direct traffic)
- **Network Media** = Roads themselves (carry vehicles/data)
- **Protocols** = Traffic laws (everyone follows same rules)

**🇬🇭 {{country}} Context:**
- MTN, Vodafone, and AirtelTigo operate vast mobile networks
- Fiber optic cables connect {{country}} to international internet
- Mobile money transactions rely on secure networks
- Over 20 million Ghanaians access the internet via networks`
      },
      {
        title: 'Types of Networks by Size',
        content: `Networks are classified by their geographic coverage, from personal devices to worldwide connections.

**PAN (Personal Area Network)**
- 📱 **Scope**: Smallest network type—YOUR personal devices
- 📏 **Range**: Within arm's reach (typically under 10 meters)
- 🔗 **Technology**: Bluetooth, USB, NFC, infrared
- ⚡ **Speed**: Varies (Bluetooth 5.0 up to 2 Mbps)
- 💡 **Examples**: 
  - Phone connected to Bluetooth earbuds
  - Smartwatch syncing with phone
  - Wireless keyboard connected to laptop
  - Transferring photos via AirDrop/Nearby Share
- 🇬🇭 **{{country}} Example**: Your phone connecting to your TWS earbuds to listen to Shatta Wale on Audiomack

**LAN (Local Area Network)**
- 🏠 **Scope**: Single building or small campus
- 📏 **Range**: Up to a few hundred meters
- 🔗 **Technology**: Ethernet cables, Wi-Fi
- ⚡ **Speed**: Very fast (100 Mbps to 10 Gbps)
- 💡 **Examples**: 
  - Home Wi-Fi network
  - School computer laboratory
  - Office network
  - Internet café in {{city:capital}}
- 🔒 **Ownership**: Privately owned and maintained
- 💰 **Cost**: Low setup and maintenance
- 🇬🇭 **{{country}} Example**: The computer lab at your school, or Busy Internet cafe

**MAN (Metropolitan Area Network)**
- 🌆 **Scope**: City or large campus
- 📏 **Range**: Up to 50 kilometers
- 🔗 **Technology**: Fiber optic, high-speed leased lines
- ⚡ **Speed**: Fast (10 Mbps to 1 Gbps)
- 💡 **Examples**: 
  - {{institution:university:premier}} network (connecting Legon campus buildings)
  - City government network
  - Cable TV network in {{city:capital}}
  - Hospital network connecting multiple facilities
- 🔒 **Ownership**: Organization or ISP
- 🇬🇭 **{{country}} Example**: GRA ({{country}} Revenue Authority) network connecting offices across {{city:capital}}

**WAN (Wide Area Network)**
- 🌍 **Scope**: Countries, continents, worldwide
- 📏 **Range**: Unlimited
- 🔗 **Technology**: Fiber optic, satellite, leased lines
- ⚡ **Speed**: Variable (depends on connection)
- 💡 **Examples**: 
  - The INTERNET (largest WAN!)
  - Bank networks (GCB branches across {{country}})
  - MTN's mobile network infrastructure
  - Multinational company networks
- 🔒 **Ownership**: Multiple organizations, ISPs
- 💰 **Cost**: High infrastructure costs
- 🇬🇭 **{{country}} Example**: MTN {{country}}'s network connecting all regions, Internet backbone through submarine cables

**Network Comparison Table:**
| Type | Range | Speed | Ownership | Cost | Example |
|------|-------|-------|-----------|------|---------|
| PAN | <10m | Low-Med | Personal | Very Low | Bluetooth |
| LAN | <1km | Very Fast | Private | Low | School Lab |
| MAN | <50km | Fast | Org/ISP | Medium | City Govt |
| WAN | Global | Variable | Multiple | High | Internet |`
      },
      {
        title: 'Network Topologies',
        content: `Network topology refers to the physical or logical arrangement of devices in a network. The topology you choose affects performance, reliability, and cost.

**Bus Topology**
- 📊 **Structure**: All devices connect to a single central cable (backbone/bus)
- ➕ **Advantages**:
  - Easy to install and extend
  - Requires less cable than other topologies
  - Cost-effective for small networks
- ➖ **Disadvantages**:
  - Single point of failure (if backbone fails, entire network fails)
  - Performance degrades as more devices are added
  - Difficult to troubleshoot
  - Security concerns (all data visible to all devices)
- 💡 **Best For**: Small, temporary networks

**Star Topology** ⭐
- 📊 **Structure**: All devices connect to a central hub or switch
- ➕ **Advantages**:
  - Easy to install and manage
  - If one cable fails, only that device is affected
  - Easy to add new devices
  - Easy to detect and isolate faults
- ➖ **Disadvantages**:
  - If central hub fails, entire network fails
  - Requires more cable than bus topology
  - Cost of central device (hub/switch)
- 💡 **Best For**: Most modern networks (homes, offices, schools)
- 🇬🇭 **{{country}} Example**: Most school computer labs use star topology with a central switch

**Ring Topology** 🔄
- 📊 **Structure**: Devices connected in a circular chain; data travels in one direction
- ➕ **Advantages**:
  - Equal access for all devices
  - No data collisions
  - Can cover larger distances than star
- ➖ **Disadvantages**:
  - If one device fails, entire network can fail
  - Adding or removing devices disrupts network
  - Data must pass through all devices
- 💡 **Best For**: Token Ring networks (mostly legacy)

**Mesh Topology** 🕸️
- 📊 **Structure**: Every device connects to every other device
- **Full Mesh**: Every device has direct connection to all others
- **Partial Mesh**: Some devices have multiple connections
- ➕ **Advantages**:
  - Highly reliable—multiple paths for data
  - No single point of failure
  - Can handle high traffic
- ➖ **Disadvantages**:
  - Very expensive (lots of cables and ports)
  - Complex to install and manage
  - Impractical for large networks
- 💡 **Best For**: Critical systems requiring maximum uptime (military, hospitals)
- 🇬🇭 **{{country}} Example**: Bank data centers may use partial mesh for redundancy

**Hybrid Topology** 
- 📊 **Structure**: Combination of two or more topologies
- 💡 **Example**: Star-Bus (multiple star networks connected via bus)
- ➕ **Advantages**: Flexible, scalable, reliable
- 🇬🇭 **{{country}} Example**: Large organizations like universities combine topologies

**Choosing a Topology:**
| Factor | Bus | Star | Ring | Mesh |
|--------|-----|------|------|------|
| Cost | Low | Medium | Medium | High |
| Reliability | Low | Medium | Low | High |
| Scalability | Low | High | Low | Medium |
| Ease of Setup | Easy | Easy | Medium | Hard |
| Troubleshooting | Hard | Easy | Medium | Hard |`
      },
      {
        title: 'Network Devices',
        content: `Network devices are the hardware that connects computers and manages data flow. Understanding these devices helps you build, troubleshoot, and secure networks.

**Hub** 🔌
- 📝 **Function**: Connects multiple devices in a network
- 🔄 **Operation**: Broadcasts data to ALL connected devices
- ❌ **Limitation**: Inefficient—creates unnecessary traffic
- 💡 **Status**: Mostly obsolete, replaced by switches
- 📊 **OSI Layer**: Physical (Layer 1)

**Switch** 🔀
- 📝 **Function**: Connects devices and directs data to specific destinations
- 🔄 **Operation**: Learns MAC addresses, sends data only to intended recipient
- ✅ **Advantage**: More efficient and secure than hub
- 💡 **Use Case**: Core device in most LANs
- 📊 **OSI Layer**: Data Link (Layer 2)
- 🇬🇭 **{{country}} Example**: The device connecting computers in your school lab

**Router** 🌐
- 📝 **Function**: Connects different networks and routes data between them
- 🔄 **Operation**: Uses IP addresses to find best path for data
- 🔥 **Features**: Often includes firewall, NAT, DHCP
- 💡 **Use Case**: Connecting your home/office to the internet
- 📊 **OSI Layer**: Network (Layer 3)
- 🇬🇭 **{{country}} Example**: Your home Wi-Fi router from MTN or Vodafone

**Modem** 📡
- 📝 **Function**: Converts digital signals to analog (and vice versa)
- 🔄 **Operation**: MOdulates and DEModulates signals
- 💡 **Types**: 
  - DSL modem (phone lines)
  - Cable modem (coaxial cable)
  - Fiber modem (ONT for fiber optics)
  - Mobile modem/MiFi (cellular data)
- 📊 **Use Case**: Connecting to ISP
- 🇬🇭 **{{country}} Example**: The MiFi device from MTN or Vodafone for mobile internet

**Wireless Access Point (WAP)** 📶
- 📝 **Function**: Creates Wi-Fi network for wireless devices
- 🔄 **Operation**: Bridges wired and wireless networks
- 💡 **Standards**: Wi-Fi 4 (n), Wi-Fi 5 (ac), Wi-Fi 6 (ax)
- 📊 **Use Case**: Extending wireless coverage
- 🇬🇭 **{{country}} Example**: Wi-Fi hotspots at {{city:capital}} Mall or airport

**Firewall** 🔥
- 📝 **Function**: Security device that monitors and filters network traffic
- 🔄 **Operation**: Allows or blocks traffic based on rules
- 💡 **Types**: Hardware firewall, Software firewall
- 📊 **Use Case**: Protecting networks from unauthorized access
- 🇬🇭 **{{country}} Example**: Banks use firewalls to protect customer data

**Network Interface Card (NIC)** 💳
- 📝 **Function**: Allows computer to connect to network
- 🔄 **Types**: Wired (Ethernet port) or Wireless (Wi-Fi adapter)
- 💡 **Identifier**: Has unique MAC address
- 📊 **Status**: Built into most modern devices

**Device Comparison:**
| Device | Function | Sends To | OSI Layer |
|--------|----------|----------|-----------|
| Hub | Connect devices | Everyone | 1 (Physical) |
| Switch | Connect devices | Specific device | 2 (Data Link) |
| Router | Connect networks | Best path | 3 (Network) |
| Modem | Signal conversion | ISP | 1-2 |
| WAP | Wireless access | Wireless devices | 1-2 |
| Firewall | Security | Allowed traffic | 3-7 |`
      },
      {
        title: 'Network Protocols and the OSI Model',
        content: `Protocols are the rules and standards that govern how devices communicate on a network. The OSI model provides a framework for understanding these protocols.

**What are Protocols?**
Think of protocols as languages—for devices to communicate, they must speak the same language!

**Common Protocols:**
- **TCP/IP**: Foundation of internet communication
- **HTTP/HTTPS**: Web browsing (S = Secure)
- **FTP**: File transfer
- **SMTP/POP3/IMAP**: Email
- **DNS**: Domain name to IP address translation
- **DHCP**: Automatic IP address assignment
- **SSH**: Secure remote access

**The OSI Model (7 Layers)**
The Open Systems Interconnection model explains how data travels through a network.

**Layer 7: Application** 📱
- 💡 What users interact with
- 📋 Protocols: HTTP, HTTPS, FTP, SMTP, DNS
- 🇬🇭 Example: Using Chrome to browse Jumia {{country}}

**Layer 6: Presentation** 🎨
- 💡 Data formatting, encryption, compression
- 📋 Functions: SSL/TLS encryption, JPEG/MP3 formats
- 🇬🇭 Example: HTTPS encrypting your mobile money PIN

**Layer 5: Session** 🤝
- 💡 Manages connections between applications
- 📋 Functions: Start, maintain, end sessions
- 🇬🇭 Example: Keeping you logged into WhatsApp

**Layer 4: Transport** 🚚
- 💡 Reliable data delivery, error checking
- 📋 Protocols: TCP (reliable), UDP (fast)
- 🇬🇭 Example: TCP ensures all of your message arrives complete

**Layer 3: Network** 🗺️
- 💡 Routing data between different networks
- 📋 Protocols: IP, ICMP (ping)
- 📦 Data Unit: Packets
- 🇬🇭 Example: Router directing your data to Facebook's servers

**Layer 2: Data Link** 🔗
- 💡 Node-to-node data transfer, error detection
- 📋 Protocols: Ethernet, Wi-Fi (802.11)
- 📦 Data Unit: Frames
- 💳 Uses MAC addresses
- 🇬🇭 Example: Your laptop's Wi-Fi card communicating with router

**Layer 1: Physical** ⚡
- 💡 Physical transmission of raw bits
- 📋 Components: Cables, connectors, signals
- 📦 Data Unit: Bits (0s and 1s)
- 🇬🇭 Example: Electrical signals through Ethernet cable

**TCP/IP Model (4 Layers)**
Simplified, practical model used in real networks:
1. **Application** (OSI 5-7): HTTP, FTP, DNS, SMTP
2. **Transport** (OSI 4): TCP, UDP
3. **Internet** (OSI 3): IP, ICMP
4. **Network Access** (OSI 1-2): Ethernet, Wi-Fi

**Remember OSI Layers (Top to Bottom):**
"**A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing"
Application → Presentation → Session → Transport → Network → Data Link → Physical

**Data Encapsulation:**
As data moves down the layers, each layer adds its own header:
Application Data → Segment (TCP) → Packet (IP) → Frame (Ethernet) → Bits (Physical)`
      },
      {
        title: 'IP Addressing and DNS',
        content: `Every device on a network needs a unique address to send and receive data. IP addresses are like phone numbers for computers.

**What is an IP Address?**
- A unique numerical identifier for every device on a network
- Like a postal address for your computer
- Two versions: IPv4 and IPv6

**IPv4 (Internet Protocol version 4)**
- 📊 **Format**: Four numbers (0-255) separated by dots
- 💡 **Example**: 192.168.1.100
- 📏 **Total Addresses**: ~4.3 billion (not enough!)
- 🔢 **Binary**: 32 bits (4 bytes)

**IPv4 Classes:**
| Class | Range | Use | Private Range |
|-------|-------|-----|---------------|
| A | 1-126 | Large orgs | 10.0.0.0 - 10.255.255.255 |
| B | 128-191 | Medium orgs | 172.16.0.0 - 172.31.255.255 |
| C | 192-223 | Small orgs | 192.168.0.0 - 192.168.255.255 |
| D | 224-239 | Multicast | - |
| E | 240-255 | Experimental | - |

**Private vs Public IP:**
- **Private IP**: Used within your local network (192.168.x.x, 10.x.x.x)
- **Public IP**: Your address on the internet (assigned by ISP)
- **NAT**: Translates private to public addresses

**IPv6 (Internet Protocol version 6)**
- 📊 **Format**: Eight groups of hexadecimal numbers
- 💡 **Example**: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
- 📏 **Total Addresses**: 340 undecillion (enough for every grain of sand!)
- 🔢 **Binary**: 128 bits
- 🌍 **Status**: Gradually replacing IPv4

**Subnet Mask**
- Defines which part of IP is network vs host
- **Example**: 255.255.255.0 means first three octets are network
- **CIDR Notation**: /24 means 24 bits for network (192.168.1.0/24)

**DNS (Domain Name System)**
The internet's phonebook—translates domain names to IP addresses.

**How DNS Works:**
1. You type www.mtn.com.gh in browser
2. Your computer asks DNS server: "What's the IP for mtn.com.gh?"
3. DNS server responds: "41.138.182.10" (example)
4. Your browser connects to that IP address
5. MTN's website loads!

**DNS Hierarchy:**
- **Root Servers**: Top of the hierarchy (13 worldwide)
- **TLD Servers**: .com, .org, .gh, .edu
- **Authoritative Servers**: Store actual domain records
- **Local DNS**: Your ISP's DNS (or Google: 8.8.8.8)

**🇬🇭 {{country}} Context:**
- .gh is {{country}}'s country code TLD
- MTN {{country}}'s DNS servers handle millions of queries
- Mobile money uses IP networks for transactions
- Your router assigns private IPs via DHCP`
      },
      {
        title: 'Wired vs Wireless Networking',
        content: `Networks use different media to transmit data. Understanding wired and wireless options helps you choose the right solution.

**Wired Networking Technologies**

**Ethernet (IEEE 802.3)** 🔌
- 📝 **Description**: Most common LAN technology
- ⚡ **Speeds**:
  - Fast Ethernet: 100 Mbps
  - Gigabit Ethernet: 1 Gbps
  - 10 Gigabit: 10 Gbps
- 🔗 **Connector**: RJ-45
- 📊 **Cable Types**:

**Twisted Pair Cables:**
| Category | Speed | Distance | Use |
|----------|-------|----------|-----|
| Cat5 | 100 Mbps | 100m | Legacy |
| Cat5e | 1 Gbps | 100m | Common |
| Cat6 | 10 Gbps | 55m | Modern |
| Cat6a | 10 Gbps | 100m | Professional |
| Cat7 | 10 Gbps | 100m | Data centers |

**Fiber Optic Cables** 💎
- 📝 **Description**: Uses light pulses through glass/plastic fibers
- ⚡ **Speed**: Up to 100+ Gbps
- 📏 **Distance**: Kilometers without signal loss
- 🔒 **Security**: Harder to tap than copper
- ➕ **Advantages**: Fast, long distance, immune to interference
- ➖ **Disadvantages**: Expensive, fragile, needs special tools
- 💡 **Types**:
  - Single-mode: Long distance, one light path
  - Multi-mode: Shorter distance, multiple light paths
- 🇬🇭 **{{country}} Example**: MainOne submarine cable connecting {{country}} to Europe

**Wireless Networking Technologies**

**Wi-Fi (IEEE 802.11)** 📶
- 📝 **Description**: Wireless LAN technology
- 📻 **Frequencies**: 2.4 GHz and 5 GHz

| Standard | Name | Speed | Frequency | Year |
|----------|------|-------|-----------|------|
| 802.11b | - | 11 Mbps | 2.4 GHz | 1999 |
| 802.11g | - | 54 Mbps | 2.4 GHz | 2003 |
| 802.11n | Wi-Fi 4 | 600 Mbps | 2.4/5 GHz | 2009 |
| 802.11ac | Wi-Fi 5 | 3.5 Gbps | 5 GHz | 2013 |
| 802.11ax | Wi-Fi 6 | 9.6 Gbps | 2.4/5/6 GHz | 2019 |

**2.4 GHz vs 5 GHz:**
| Feature | 2.4 GHz | 5 GHz |
|---------|---------|-------|
| Range | Better (longer) | Shorter |
| Speed | Slower | Faster |
| Interference | More (microwaves, Bluetooth) | Less |
| Walls | Penetrates better | Blocked more |

**Bluetooth** 🔵
- 📝 **Description**: Short-range wireless for personal devices
- 📏 **Range**: Up to 10 meters (Class 2)
- ⚡ **Speed**: Up to 3 Mbps (Bluetooth 5.0)
- 💡 **Use Cases**: Headphones, keyboards, file transfer
- 🇬🇭 **Example**: Connecting your phone to car stereo

**Cellular Networks (Mobile Data)** 📱
| Generation | Speed | Features |
|------------|-------|----------|
| 2G | 0.1 Mbps | Voice, SMS |
| 3G | 2 Mbps | Mobile internet |
| 4G/LTE | 100 Mbps | HD streaming |
| 5G | 1+ Gbps | Ultra-fast, low latency |

🇬🇭 **{{country}} Status**: 4G LTE widespread, 5G beginning rollout

**Wired vs Wireless Comparison:**
| Factor | Wired | Wireless |
|--------|-------|----------|
| Speed | Faster, stable | Variable |
| Security | More secure | Less secure |
| Mobility | None | High |
| Installation | Complex | Easy |
| Cost | Higher initial | Lower |
| Reliability | Very reliable | Can have interference |`
      },
      {
        title: 'Network Security Basics',
        content: `Network security protects your data and systems from unauthorized access, attacks, and damage. In our connected world, security is essential!

**Why Network Security Matters:**
- 🔒 Protect personal information
- 💰 Secure financial transactions (mobile money!)
- 🏢 Safeguard business data
- 🛡️ Prevent cyber attacks
- ⚖️ Comply with laws and regulations

**Common Network Threats:**

**1. Malware** 🦠
- **Viruses**: Attach to files, spread when opened
- **Worms**: Self-replicate across networks
- **Trojans**: Disguised as legitimate software
- **Ransomware**: Encrypts files, demands payment
- 🇬🇭 **Example**: Fake mobile money apps stealing credentials

**2. Phishing** 🎣
- Fake emails/websites tricking users
- Steal passwords, credit card info
- 🇬🇭 **Example**: Fake MTN messages asking for PIN

**3. Man-in-the-Middle (MitM)** 👤
- Attacker intercepts communication
- Can read or modify data
- Common on public Wi-Fi

**4. Denial of Service (DoS/DDoS)** 💥
- Overwhelms servers with traffic
- Makes services unavailable
- DDoS uses multiple attacking computers

**5. Password Attacks** 🔑
- Brute force: Try every combination
- Dictionary: Try common passwords
- Credential stuffing: Use leaked passwords

**Security Measures:**

**Firewalls** 🔥
- Monitors incoming/outgoing traffic
- Blocks unauthorized access
- Can be hardware or software
- 💡 **Tip**: Enable Windows Firewall!

**Encryption** 🔐
- Converts data to unreadable format
- Only decrypted with correct key
- **Types**:
  - HTTPS: Secure web browsing
  - WPA3: Secure Wi-Fi
  - End-to-end: WhatsApp messages
- 🇬🇭 **Example**: Mobile money transactions are encrypted

**VPN (Virtual Private Network)** 🛡️
- Creates encrypted tunnel over internet
- Hides your IP address and location
- Secures public Wi-Fi connections
- 🇬🇭 **Use Case**: Safe browsing at internet cafe

**Authentication Methods:**
- **Passwords**: Something you know
- **Biometrics**: Something you are (fingerprint)
- **2FA/MFA**: Multiple factors (password + SMS code)
- 🇬🇭 **Example**: MTN MoMo uses PIN + phone number

**Wi-Fi Security Protocols:**
| Protocol | Security | Status |
|----------|----------|--------|
| WEP | Very weak | Obsolete |
| WPA | Weak | Legacy |
| WPA2 | Good | Common |
| WPA3 | Excellent | Newest |

**Security Best Practices:**
1. ✅ Use strong, unique passwords
2. ✅ Enable two-factor authentication
3. ✅ Keep software updated
4. ✅ Use WPA2/WPA3 for Wi-Fi
5. ✅ Be cautious of public Wi-Fi
6. ✅ Don't click suspicious links
7. ✅ Install reputable antivirus
8. ✅ Back up important data
9. ✅ Use HTTPS websites
10. ✅ Never share your mobile money PIN!`
      },
      {
        title: 'Troubleshooting Network Issues',
        content: `Network problems happen! Knowing how to diagnose and fix common issues is a valuable skill.

**Common Network Problems:**

**1. No Internet Connection** ❌
- 🔍 **Check**: Is Wi-Fi connected? Is cable plugged in?
- 🔄 **Try**: Restart router and device
- 📡 **Verify**: Other devices working?
- 📞 **Contact**: ISP if widespread issue

**2. Slow Internet** 🐌
- 🔍 **Causes**: 
  - Too many devices
  - Distance from router
  - Interference
  - ISP throttling
  - Background downloads
- 🔧 **Fix**:
  - Move closer to router
  - Disconnect unused devices
  - Check for malware
  - Use 5 GHz Wi-Fi if available

**3. Intermittent Connection** ⚡
- 🔍 **Causes**: 
  - Signal interference
  - Faulty cables
  - Overheating router
  - ISP issues
- 🔧 **Fix**:
  - Change Wi-Fi channel
  - Replace cables
  - Ensure router ventilation
  - Update firmware

**4. Can't Connect to Specific Site** 🚫
- 🔍 **Check**: Does it load on other devices?
- 🔄 **Try**: Clear browser cache
- 🌐 **Test**: Use different DNS (8.8.8.8)
- ⏰ **Wait**: Site might be down

**Diagnostic Tools:**

**ping** 🏓
- Tests if you can reach a destination
- Command: \`ping google.com\` or \`ping 8.8.8.8\`
- Shows response time and packet loss
- 💡 If ping works but browsing doesn't: DNS issue

**ipconfig / ifconfig** 📋
- Shows your network configuration
- Windows: \`ipconfig\`
- Displays IP address, subnet, gateway
- \`ipconfig /release\` and \`ipconfig /renew\` to refresh IP

**traceroute / tracert** 🗺️
- Shows path data takes to destination
- Windows: \`tracert google.com\`
- Identifies where problems occur

**nslookup** 🔍
- Tests DNS resolution
- Command: \`nslookup mtn.com.gh\`
- Shows if DNS is working

**Troubleshooting Steps:**
1. **Identify**: What exactly isn't working?
2. **Isolate**: Is it one device or all devices?
3. **Check Physical**: Cables, power, lights
4. **Restart**: Router, modem, device (the IT classic!)
5. **Test**: Use ping, check IP address
6. **Research**: Search error messages online
7. **Escalate**: Contact ISP if needed

**Router LED Indicators:**
- 🟢 **Solid Green**: Normal operation
- 🟢 **Blinking Green**: Data transfer
- 🟠 **Orange/Amber**: Limited connectivity
- 🔴 **Red**: Error or no connection
- ⚫ **Off**: No power

**🇬🇭 {{country}}-Specific Tips:**
- Power cuts can reset routers—check settings after 'lights off'
- MTN/Vodafone hotlines for mobile data issues
- Internet cafes often have technicians who can help
- Check data bundle balance before assuming network problem
- Peak hours (evenings) may have slower speeds`
      },
      {
        title: 'Networking in {{country}}',
        content: `Let's explore how networking technology powers everyday life in {{country}}!

**Internet Service Providers (ISPs):**
- **MTN {{country}}**: Largest mobile network, offers fiber and 4G
- **Vodafone {{country}}**: Fiber to home, mobile data
- **AirtelTigo**: Mobile data services
- **Surfline**: 4G LTE provider
- **Busy Internet**: Business connectivity
- **MainOne**: Fiber backbone provider

**Internet Infrastructure:**
- 🌊 **Submarine Cables**: MainOne, SAT-3/WASC, ACE connect {{country}} to global internet
- 🏗️ **Fiber Networks**: Expanding in major cities
- 📡 **4G/LTE Coverage**: Available in urban areas
- 🛰️ **5G**: Beginning deployment in {{city:capital}}

**Mobile Money Networks:**
- 💰 **MTN Mobile Money (MoMo)**: Largest platform
- 💰 **Vodafone Cash**: Second largest
- 💰 **AirtelTigo Money**: Growing platform
- 📊 **Technology**: Uses USSD (*170#) and apps over mobile networks
- 🔒 **Security**: Encrypted transactions, PIN verification

**How Mobile Money Works:**
1. You dial *170# (MTN) - USSD request over network
2. Request goes to MTN's servers
3. Server verifies your account and PIN
4. Transaction processed in secure database
5. Confirmation SMS sent back to you
6. All over cellular network in seconds!

**E-Learning in {{country}}:**
- 📚 **Platforms**: {{country}} Learning TV, iCampus, Edmodo
- 💻 **Challenges**: Internet access, data costs
- 🎓 **Growth**: COVID-19 accelerated adoption
- 📱 **Access**: Most students use mobile devices

**Government Networks:**
- 🏛️ **e-{{country}} Project**: Digitizing government services
- 📋 **{{country}}.gov**: Online government services
- 🆔 **{{country}} Card**: Networked national ID system
- 💼 **GRA**: Tax filing online

**Business Networking:**
- 🏪 **Point of Sale (POS)**: Connected to bank networks
- 🏦 **Banking**: Online banking, mobile apps, ATMs
- 📦 **Delivery Apps**: Jumia, Bolt Food use networks
- 🚗 **Ride-hailing**: Uber, Bolt rely on GPS and networks

**Future of Networking in {{country}}:**
- 🚀 **5G Rollout**: Ultra-fast mobile internet
- 🏠 **Fiber Expansion**: More homes with fast internet
- 🌐 **Starlink**: Satellite internet option
- 🏙️ **Smart Cities**: Connected infrastructure
- 📱 **IoT Growth**: More connected devices

**Career Opportunities:**
- 👨‍💻 **Network Engineer**: Design and maintain networks
- 🔒 **Cybersecurity Analyst**: Protect networks from threats
- 📞 **Network Administrator**: Manage daily operations
- 📡 **Telecommunications Technician**: Install and repair
- 💼 **IT Support Specialist**: Help desk and troubleshooting

**🎓 Where to Study:**
- {{institution:university:premier}} (Computer Science)
- {{institution:university:tech}} (Telecommunications Engineering)
- Ashesi University (Computer Science)
- IPMC (Professional IT certifications)
- Cisco Networking Academy (CCNA certification)`
      }
    ],
    activities: {
      type: 'shortanswer',
      questions: [
        {
          question: 'Walk through your school and identify all network components (routers, cables, access points, switches). Create a detailed map showing how devices are connected.',
          sampleAnswer: 'Network map should include: Main router location (server room), Ethernet cables running through ceiling to classrooms, Wi-Fi access points in each building, Network switch in computer lab connecting 20 computers in star topology, Printer connected via network cable, Modem connecting to ISP. Draw lines showing physical connections between all devices.'
        },
        {
          question: 'List 10 different networks you interact with daily and classify each as PAN, LAN, MAN, or WAN. Explain why each belongs to that category.',
          sampleAnswer: 'PAN: Bluetooth earbuds (few meters range), Smartwatch connection (personal devices). LAN: Home Wi-Fi (single building), School computer lab (campus network). MAN: University network across campuses (city-wide). WAN: MTN mobile network (nationwide), The Internet (worldwide), WhatsApp servers (global), Mobile Money network (national infrastructure), Online banking (connects multiple branches).'
        },
        {
          question: 'Design a network for a small business with 10 computers, 2 printers, and Wi-Fi for visitors. Specify topology, devices needed, and cabling.',
          sampleAnswer: 'Recommended: Star topology for reliability. Devices needed: 1 Router with firewall (connects to ISP), 1 24-port managed switch, 1 Wireless Access Point for guest Wi-Fi. Cabling: Cat6 Ethernet cables from each computer and printer to switch. Network design: Separate VLAN for guest Wi-Fi, wired connections for employees, UPS for router and switch. Estimated cost: GH{{currency}}3,000-5,000.'
        },
        {
          question: 'Your computer suddenly cannot access the internet but shows Wi-Fi connected. Write step-by-step troubleshooting process.',
          sampleAnswer: '1. Check if other devices can connect (isolate problem). 2. Open Command Prompt, run "ping 8.8.8.8" to test IP connectivity. 3. Run "ping google.com" to test DNS. 4. If ping fails, run "ipconfig" to check IP address. 5. Try "ipconfig /release" then "ipconfig /renew" to get new IP. 6. Check router—is internet light on? 7. Restart router if needed. 8. If still failing, try different DNS (8.8.8.8). 9. Disable/enable network adapter. 10. Check if ISP has outage.'
        }
      ]
    },
    pastQuestions: [
      {
        year: '2023',
        question: 'Differentiate between LAN and WAN networks with examples.',
        answer: 'LAN (Local Area Network) covers a small geographic area like a single building or campus. Characteristics: High speed (up to 10 Gbps), privately owned, low cost, uses Ethernet/Wi-Fi. Example: School computer laboratory. WAN (Wide Area Network) covers large geographic areas—cities, countries, or worldwide. Characteristics: Variable speeds, uses leased lines/fiber, higher cost, often uses public infrastructure. Example: The Internet, MTN {{country}}\'s mobile network.'
      },
      {
        year: '2022',
        question: 'Explain the functions of the following network devices: (a) Router (b) Switch (c) Modem',
        answer: '(a) Router: Connects different networks and routes data between them using IP addresses. Finds best path for data packets. Example: Connects your home network to the internet. (b) Switch: Connects devices within a LAN and forwards data only to the intended recipient using MAC addresses. More efficient than hub. Example: Connects computers in school lab. (c) Modem: Modulates and demodulates signals—converts digital computer signals to analog (and vice versa) for transmission over phone lines, cable, or fiber. Example: DSL modem for home internet.'
      },
      {
        year: '2021',
        question: 'Describe THREE types of network topologies and state one advantage and one disadvantage of each.',
        answer: '1. Star Topology: All devices connect to central hub/switch. Advantage: Easy to troubleshoot—fault affects only one device. Disadvantage: Central device failure brings down entire network. 2. Bus Topology: All devices connect to single backbone cable. Advantage: Easy and cheap to install, uses less cable. Disadvantage: Single point of failure—backbone damage affects all. 3. Mesh Topology: Each device connects to multiple others. Advantage: Highly reliable—multiple paths for data. Disadvantage: Very expensive—requires many cables and ports.'
      },
      {
        year: '2020',
        question: 'What is an IP address? Distinguish between IPv4 and IPv6.',
        answer: 'An IP address is a unique numerical identifier assigned to every device on a network, allowing devices to locate and communicate with each other. IPv4: Uses 32-bit addresses written as four decimal numbers (0-255) separated by dots. Example: 192.168.1.100. Provides about 4.3 billion addresses—not enough for modern needs. IPv6: Uses 128-bit addresses written as eight groups of hexadecimal numbers. Example: 2001:0db8:85a3::8a2e:0370:7334. Provides virtually unlimited addresses for future growth.'
      },
      {
        year: '2019',
        question: 'Explain the importance of network security. List FOUR security measures.',
        answer: 'Network security is important because it: Protects sensitive data from theft, Prevents unauthorized access to systems, Ensures business continuity, Maintains customer trust, and Complies with regulations. Four security measures: 1. Firewall: Monitors and filters network traffic based on security rules. 2. Encryption: Converts data to unreadable format—only authorized users can decrypt. 3. Strong passwords with 2FA: Prevents unauthorized access using multi-factor authentication. 4. VPN (Virtual Private Network): Creates secure encrypted tunnel for data transmission, especially on public networks.'
      },
      {
        year: '2023',
        question: 'Compare wired and wireless networking, stating TWO advantages of each.',
        answer: 'Wired Networking Advantages: 1. Faster and more stable speeds—Gigabit Ethernet provides consistent 1 Gbps. 2. More secure—data travels through physical cables, harder to intercept. Wireless Networking Advantages: 1. Mobility—users can move freely while connected. 2. Easy installation—no need to run cables through walls. Wired is best for fixed workstations needing reliability; wireless is best for mobile devices and convenience.'
      },
      {
        year: '2022',
        question: 'Briefly explain the OSI model and state the function of the Network layer.',
        answer: 'The OSI (Open Systems Interconnection) model is a conceptual framework with 7 layers that describes how data travels through a network. Layers from top to bottom: Application, Presentation, Session, Transport, Network, Data Link, Physical. The Network Layer (Layer 3) is responsible for: 1. Logical addressing using IP addresses. 2. Routing—determining best path for data packets between networks. 3. Packet forwarding—moving packets from source to destination across multiple networks. Devices at this layer: Routers. Protocols: IP, ICMP.'
      },
      {
        year: '2021',
        question: 'What is DNS? Explain how it works when you type a website address.',
        answer: 'DNS (Domain Name System) is the internet\'s phonebook that translates human-readable domain names to IP addresses. How it works: 1. You type www.google.com in browser. 2. Computer checks local DNS cache for IP. 3. If not found, query sent to DNS server (usually ISP\'s). 4. DNS server checks its records or queries higher-level servers. 5. Eventually, authoritative DNS server responds with IP address (e.g., 142.250.190.46). 6. Browser uses IP to connect to Google\'s server. 7. IP stored in cache for faster future access. This process happens in milliseconds.'
      }
    ],
    summary: `In this comprehensive lesson on Networking Fundamentals, we explored how computers and devices connect and communicate:

**Key Takeaways:**

🌐 **What is a Network?**: Collection of interconnected devices sharing resources and data. Components include end devices, network devices, media, and protocols.

📊 **Network Types by Size**:
- PAN: Personal devices (Bluetooth range)
- LAN: Building/campus (home Wi-Fi, school lab)
- MAN: City-wide (university network)
- WAN: Global (The Internet, MTN network)

🔷 **Network Topologies**:
- Star: Central hub, easy troubleshooting (most common)
- Bus: Single backbone, cheap but fragile
- Ring: Circular, equal access
- Mesh: Multiple paths, highly reliable

🔌 **Network Devices**:
- Router: Connects networks, routes by IP
- Switch: Connects devices in LAN, uses MAC addresses
- Modem: Converts signals for ISP
- WAP: Provides Wi-Fi access

📚 **OSI Model**: 7 layers from Physical (bits) to Application (user interface). Helps understand how data travels through networks.

🔢 **IP Addressing**: IPv4 (32-bit, running out) and IPv6 (128-bit, unlimited). DNS translates domain names to IP addresses.

📶 **Wired vs Wireless**:
- Wired: Faster, more secure (Ethernet, fiber)
- Wireless: Mobile, convenient (Wi-Fi, Bluetooth, cellular)

🔒 **Network Security**: Firewalls, encryption, VPNs, strong passwords, and 2FA protect against threats like malware, phishing, and attacks.

🔧 **Troubleshooting**: Use ping, ipconfig, tracert to diagnose. Restart devices, check cables, verify DNS.

🇬🇭 **{{country}} Context**: MTN, Vodafone power connectivity. Mobile money relies on secure networks. Fiber expansion continues.

Understanding networking opens doors to IT careers and helps you navigate our connected world!`,
    endOfLessonQuiz: [
      {
        id: '1',
        type: 'mcq',
        question: 'Which type of network typically covers a single building or campus?',
        options: ['WAN', 'MAN', 'LAN', 'PAN'],
        answer: 'LAN',
        explanation: 'LAN (Local Area Network) typically covers a small area like a single building, home, school campus, or office.'
      },
      {
        id: '2',
        type: 'mcq',
        question: 'The Internet is an example of which network type?',
        options: ['PAN', 'LAN', 'MAN', 'WAN'],
        answer: 'WAN',
        explanation: 'The Internet is the largest WAN (Wide Area Network), connecting computers and networks across the entire world.'
      },
      {
        id: '3',
        type: 'mcq',
        question: 'Which network device uses IP addresses to route data between different networks?',
        options: ['Hub', 'Switch', 'Router', 'Modem'],
        answer: 'Router',
        explanation: 'A router connects different networks and uses IP addresses (Network Layer 3) to determine the best path for data packets.'
      },
      {
        id: '4',
        type: 'mcq',
        question: 'In star topology, what happens if the central device fails?',
        options: ['Only one computer fails', 'Network continues normally', 'Entire network fails', 'Network slows down'],
        answer: 'Entire network fails',
        explanation: 'In star topology, all devices connect to the central hub/switch. If it fails, no device can communicate—the entire network goes down.'
      },
      {
        id: '5',
        type: 'mcq',
        question: 'Which protocol converts domain names like "google.com" to IP addresses?',
        options: ['HTTP', 'TCP', 'DNS', 'DHCP'],
        answer: 'DNS',
        explanation: 'DNS (Domain Name System) is the internet\'s phonebook—it translates human-readable domain names to IP addresses that computers use.'
      },
      {
        id: '6',
        type: 'mcq',
        question: 'What is the maximum number of addresses available in IPv4?',
        options: ['About 1 million', 'About 4.3 billion', 'About 340 trillion', 'Unlimited'],
        answer: 'About 4.3 billion',
        explanation: 'IPv4 uses 32-bit addresses, allowing for approximately 4.3 billion unique addresses—which is not enough for all devices today.'
      },
      {
        id: '7',
        type: 'mcq',
        question: 'Which OSI layer is responsible for routing data between networks?',
        options: ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'],
        answer: 'Network Layer',
        explanation: 'The Network Layer (Layer 3) handles logical addressing (IP) and routing—determining the best path for data between networks.'
      },
      {
        id: '8',
        type: 'mcq',
        question: 'What type of cable uses light pulses to transmit data?',
        options: ['Coaxial cable', 'Twisted pair cable', 'Fiber optic cable', 'Ethernet cable'],
        answer: 'Fiber optic cable',
        explanation: 'Fiber optic cables transmit data as light pulses through glass or plastic fibers, allowing very high speeds over long distances.'
      },
      {
        id: '9',
        type: 'mcq',
        question: 'Which Wi-Fi frequency offers faster speeds but shorter range?',
        options: ['2.4 GHz', '5 GHz', 'Both are equal', '1 GHz'],
        answer: '5 GHz',
        explanation: '5 GHz Wi-Fi offers faster speeds but shorter range and doesn\'t penetrate walls as well. 2.4 GHz has better range but slower speeds.'
      },
      {
        id: '10',
        type: 'mcq',
        question: 'What security measure creates an encrypted tunnel over the internet?',
        options: ['Firewall', 'Antivirus', 'VPN', 'Password'],
        answer: 'VPN',
        explanation: 'A VPN (Virtual Private Network) creates an encrypted tunnel for your data, protecting it from interception—especially useful on public Wi-Fi.'
      },
      {
        id: '11',
        type: 'mcq',
        question: 'Which command tests if you can reach another device on the network?',
        options: ['ipconfig', 'ping', 'tracert', 'nslookup'],
        answer: 'ping',
        explanation: 'The ping command sends packets to a destination and measures response time—useful for testing basic connectivity.'
      },
      {
        id: '12',
        type: 'mcq',
        question: 'Which network topology provides the highest reliability with multiple paths?',
        options: ['Bus', 'Star', 'Ring', 'Mesh'],
        answer: 'Mesh',
        explanation: 'Mesh topology connects each device to multiple others, providing multiple paths for data—if one path fails, others are available.'
      },
      {
        id: '13',
        type: 'mcq',
        question: 'What does a switch use to direct data to specific devices?',
        options: ['IP addresses', 'MAC addresses', 'Domain names', 'Port numbers'],
        answer: 'MAC addresses',
        explanation: 'A switch operates at Layer 2 and uses MAC (Media Access Control) addresses to forward frames only to the intended recipient device.'
      },
      {
        id: '14',
        type: 'mcq',
        question: 'Which is the strongest Wi-Fi security protocol?',
        options: ['WEP', 'WPA', 'WPA2', 'WPA3'],
        answer: 'WPA3',
        explanation: 'WPA3 is the newest and most secure Wi-Fi security protocol, offering improved encryption and protection against attacks.'
      },
      {
        id: '15',
        type: 'mcq',
        question: 'In {{country}}, which service heavily relies on secure mobile networks for transactions?',
        options: ['Email', 'Web browsing', 'Mobile Money (MoMo)', 'Social media'],
        answer: 'Mobile Money (MoMo)',
        explanation: 'Mobile Money services like MTN MoMo rely on secure, encrypted mobile networks to process millions of financial transactions safely.'
      }
    ]
  }
];
