# EldNav Design Guidelines

## Design Approach

**System Foundation**: Apple Human Interface Guidelines with Material Design accessibility enhancements
**Philosophy**: "Confidence through Clarity" - Every element serves to reduce cognitive load and build user trust
**Guiding Principles**:
- Prioritize legibility over aesthetics
- Maximize touch target sizes
- Minimize visual complexity
- Create calming, reassuring experiences

---

## Typography System

**Font Family**: System fonts (San Francisco on iOS, Roboto on Android) for maximum readability
**Hierarchy**:
- **Headings**: 32-40px, Bold (600-700 weight)
- **Body Text**: 20-24px, Regular (400 weight) 
- **Buttons/CTAs**: 22-26px, Medium (500 weight)
- **Secondary Info**: 18px, Regular (never smaller)
- **Line Height**: 1.6-1.8 for comfortable reading

**Accessibility Requirements**:
- All text must pass WCAG AAA contrast standards
- No italics or decorative fonts
- Sentence case preferred over ALL CAPS

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **4, 6, 8, 12, 16**
- Tight spacing: p-4, m-4
- Standard spacing: p-8, gap-8
- Generous spacing: p-12, py-16
- Section breaks: mb-16, mt-20

**Touch Targets**: Minimum 56px height/width for all interactive elements (buttons, cards, list items)

**Screen Structure**:
- Top navigation: Fixed header with emergency "Call Family" button
- Main content: Single-focus area, no competing elements
- Bottom action: Large, primary CTA button
- Margins: Minimum 20px on all sides

---

## Component Library

### Navigation Components
**Voice Input Panel**: 
- Large microphone button (80x80px minimum)
- "Where would you like to go?" prompt in 24px text
- Recent destinations as full-width cards with 64px height

**Active Navigation View**:
- Top: Next turn instruction (40px bold text)
- Center: Simplified map with large route line, minimal landmarks
- Bottom: Progress bar showing "500m to turn" in 22px
- Floating "Call Family" button (56x56px, top-right)

### Feedback Components
**Trip Completion Screen**:
- Large success checkmark icon (120x120px)
- "You've reached safely" message (32px)
- Simple thumbs up/down buttons (80x80px each) with 40px gap
- "Was this route comfortable?" prompt (20px)

### Family Link Dashboard
**Trip Tracking Card**:
- Large user avatar (80x80px)
- Route progress bar with percentage (24px text)
- Estimated arrival time (28px bold)
- Live location update timestamp (18px)

### Common Elements
**Buttons**:
- Height: 64px minimum
- Padding: px-8, py-4
- Border radius: rounded-xl (12px)
- Typography: 22px, medium weight
- Add backdrop blur for buttons on images

**Cards**:
- Padding: p-6
- Border radius: rounded-2xl (16px)
- Minimum height: 80px for list items
- Shadow: subtle elevation, no harsh shadows

**Input Fields**:
- Height: 64px
- Padding: px-6
- Border: 2px solid (visible focus states)
- Font size: 20px

---

## Interaction Design

**Voice Feedback**:
- Visual confirmation when voice is detected (pulsing microphone)
- Transcription appears in real-time (22px text)
- Confirmation screen before navigation starts

**Navigation Guidance**:
- Audio-first with visual reinforcement
- Simple directional arrows (left/right/straight)
- No complex maneuvers or multiple options
- Reassurance prompts: "You're doing great" at 25%, 50%, 75% progress

**Animations**: 
- Minimal and purposeful only
- Gentle fades (300ms)
- No parallax, no auto-playing carousels
- Progress indicators: smooth linear transitions

---

## Accessibility Features

**Critical Requirements**:
- Support Dynamic Type (iOS) / Font Scaling (Android)
- VoiceOver/TalkBack fully compatible
- Haptic feedback for all confirmations
- High contrast mode support
- Reduce motion support (disable all non-essential animations)

**Touch Interactions**:
- No hover states (mobile-first)
- Clear active states with scale (0.95) feedback
- Confirmation dialogs for destructive actions
- Generous spacing between interactive elements (minimum 16px)

---

## Screen-Specific Guidelines

### Home Screen
- Centered voice input with microphone (80x80px)
- "Recent Trips" section: 3-4 full-width cards
- "Favorites" section: Large destination cards with icons
- Bottom: "Emergency Contact" always visible

### Navigation Screen  
- Minimal chrome, maximum map visibility
- Next instruction fixed at top
- Current street name in 20px below instruction
- Progress: "2 of 5 turns complete" in simple language

### Family Link
- Dashboard shows all connected family members
- Live trip cards when navigation active
- Trip history with completion times
- One-tap "Enable Tracking" toggle (64px height)

---

## Images

**Hero/Welcome Screen**: 
- Warm, welcoming image showing confident senior using phone in well-lit environment
- Subtle overlay with centered welcome text
- CTA button with blurred background for contrast

**Empty States**:
- Friendly illustrations showing GPS activation or adding destinations
- Warm, human-centric imagery (not abstract icons)

**Profile/Family Section**:
- Large, circular profile photos (120x120px)
- Placeholder avatars with initials if no photo

---

## Key Success Metrics

Design decisions optimized for:
- **Trip completion rate**: Clear wayfinding reduces abandonment
- **Family Link adoption**: Easy setup increases safety net usage
- **Repeat usage**: Confidence-building UX encourages independence