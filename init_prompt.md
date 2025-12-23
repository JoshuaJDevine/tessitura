PROJECT PROMPT FOR CURSOR AGENT
Project Overview
Build a desktop React application that functions as a visual mind-mapping tool for organizing music production plugins and sample libraries. This solves the "paralysis of choice" problem modern composers face with hundreds/thousands of available sounds.
The Problem We're Solving

Modern music producers have 100-1000+ plugins and libraries
Traditional plugin browsers (especially Kontakt) are overwhelming linear lists
Users forget about valuable tools they own (the "I paid $5 for 45 plugins and never use them" problem)
Default to the same 2-3 favorites (Pigments + BBC Symphony Orchestra) instead of exploring
Hard to remember which tools pair well together
No visual/spatial way to organize instruments by workflow, mood, or relationship

Inspiration
This is similar in spirit to Cosmos (the plugin organization tool), but focused on spatial/visual organization rather than just filtering and favorites.
Core Functionality - v1
1. Visual Canvas (Primary Interface)

Infinite spatial canvas with pan and zoom
Nodes/cards representing individual instruments/plugins
Users can drag and position nodes anywhere
Cluster/group related items visually (not strict hierarchy)
Connection lines between nodes to show relationships/pairings
Color coding by category or custom tags

2. Library Management

Add instruments manually through UI forms
Scan directory feature to auto-import plugins/libraries (parse folder names)
Each instrument has:

Name
Developer/Company
Host (Kontakt, Soundbox, Standalone, VST, etc.) - visually indicated
Category (Orchestral, Synth, Drums, Effects, etc.)
Custom tags (GO-TO, Hidden Gem, Specialty, etc.)
Quick notes field (personal reminders, use cases)
Relationships/pairings with other instruments



3. Search & Discovery

Quick filter/search bar

Type "lo-fi" → highlights all matching nodes
Type "brass" → shows all brass instruments


Tag-based filtering

Toggle filters: "Show only GO-TOs", "Show only Hidden Gems", "Show only Synths"
Multiple tags can be active simultaneously


Random suggestion button

"Suggest something I haven't explored lately"
Help break out of default tool habits



4. Pairing System

Visual connections between instruments that work well together
Click a node → see connected nodes highlighted
Project templates

Pre-configured clusters (e.g., "Epic Orchestral" = BBC SO + Time Textures + Evolve + RC 48 reverb)
Users can save their own templates
Templates can be loaded onto canvas as ready-made clusters



5. Data Structure (Suggested)
javascript{
  id: string,
  name: string,
  developer: string,
  host: string, // "Kontakt", "Standalone", "VST3", "Soundbox", etc.
  category: string, // "Orchestral", "Synth", "Drums", "Effects"
  tags: string[], // ["GO-TO", "Hidden Gem", "Lo-Fi", "Experimental"]
  notes: string, // User's personal notes
  position: { x: number, y: number }, // Canvas position
  pairings: string[], // Array of IDs of related instruments
  color: string // For visual grouping
}
Example Use Cases
Use Case 1: Visual Organization by Host
User wants to see all their Kontakt libraries grouped together but still organized by type:

Large bubble labeled "Kontakt"
Smaller nodes inside: Spitfire content, Native Instruments factory, Sonokinetic, etc.
Visual indicator (icon/badge) showing "hosted in Kontakt"

Use Case 2: Workflow Templates
User is starting a fantasy film score:

Clicks "Fantasy/Medieval Template"
Canvas auto-loads cluster with: Fables + Lores + Irish Harp + BBC SO + Originals Cimbalom
Shows pairing lines between complementary instruments

Use Case 3: Breaking Default Habits
User keeps defaulting to Pigments for all synth work:

Clicks "Random Synth Suggestion"
App highlights: "RA Lofi Traveller - Last used: Never - Tagged: Hidden Gem"
User explores and adds notes: "Great for degraded ambient pads"

Use Case 4: Remembering Pairings
User discovers Time Textures works great with BBC Symphony Orchestra:

Selects both nodes
Clicks "Create Pairing"
Line connects them
Notes on Time Textures: "Layer under orchestral for sci-fi atmosphere"

Technical Requirements

React (desktop app - Electron if needed for filesystem access)
Canvas library for spatial visualization (React Flow, or custom canvas implementation)
Local storage or local database for persistence
File system access for directory scanning feature
Drag-and-drop for node positioning
Zoom/pan controls
Responsive layout optimized for desktop (1920x1080 minimum)

Design Considerations

Clean, minimal UI (inspired by tools like Figma, Miro, or Cosmos)
Dark theme preferred (standard for music production tools)
Visual hierarchy - larger nodes for frequently used tools, subtle nodes for rarely used
Color coding - customizable per category or tag
Quick actions - right-click context menus, keyboard shortcuts

Future Expansion Ideas (Not v1)

Import from DAW project files to see what you actually use
Integration with plugin hosts (query installed plugins)
Community templates/pairings
Usage analytics ("You haven't explored your World instruments in 6 months")
Mobile companion app for browsing away from studio

Starting Point Example Data
The user has 384 categorized instruments across:

24 Sample Players/Hosts (Kontakt, Opus, Soundbox, SINE, Play, etc.)
113 Orchestral instruments (strings, brass, woodwinds, choir)
40 Pianos/Keys
45 Drums/Percussion
35 Synthesizers
353 Effects

Example instruments:

BBC Symphony Orchestra (Spitfire Audio) - Tag: GO-TO, Category: Orchestral
Pigments (Arturia) - Tag: GO-TO, Category: Synth
RA Lofi Traveller (Rigid Audio) - Tag: Hidden Gem, Category: Synth, Host: VST
Time Textures Expanded (Native Instruments) - Tag: Specialty, Category: Sound Design, Host: Kontakt

Pairing: BBC Symphony Orchestra (note: "layer under orchestral for ambient/sci-fi")



Success Criteria

User can quickly visualize their entire plugin library spatially
User discovers forgotten/underutilized tools
User can quickly assemble common instrument combinations
User can find tools by workflow ("I need something lo-fi") not just category
Reduces reliance on default 2-3 favorite plugins


Questions for Agent to Consider

What canvas library would be best? (React Flow vs custom Canvas API implementation)
Should groups/clusters be first-class objects or just visual positioning?
How to handle the directory scanning - parse folder names, or require manual entry?
Best way to persist data locally - LocalStorage, IndexedDB, or SQLite?
Should relationships/pairings be bidirectional automatically?


Build this as a modular, extensible foundation. The user wants to start simple but expand it into a comprehensive musical instrument knowledge graph over time.