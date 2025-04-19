# SymptoTrack - Medical Symptom Tracker

As you complete tasks and reference relevant files update this file as our memory to help with future tasks.

## Technical Architecture

### Tech Stack
- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type safety across the codebase
- **Tailwind CSS**: For responsive styling
- **tRPC**: End-to-end typesafe API
- **Prisma**: ORM for database access
- **NextAuth.js**: Authentication solution
- **PostgreSQL**: Database for storing user data and medical information
- **React Hook Form**: Form validation and state management
- **reactjs-human-body**: SVG-based interactive body model
- **react-modal**: Modal dialog component
- **styled-components**: CSS-in-JS styling for reactjs-human-body
- **OpenAI API**: For AI-powered symptom analysis and condition prediction

### Core Components

#### 1. User Flow (5-Step Process)
- **Info**: Collect basic user information
- **Symptoms**: Interactive body model selection
- **Conditions**: AI-generated potential conditions
- **Details**: Additional questions based on selected conditions
- **Treatment**: Treatment suggestions and next steps

#### 2. Interactive Body Model
- SVG-based clickable human body model
- Hover states to highlight body parts
- Click events to select affected areas
- Mapping between body parts and possible symptoms

#### 3. AI Integration
- OpenAI GPT-4 API integration for symptom analysis
- Structured JSON responses with confidence scores
- Medical knowledge extraction and formatting
- Rate limiting and responsible API usage
- Custom prompt engineering for clinical accuracy

#### 4. Data Model
- **User**: Profile information and history
- **Session**: Tracking user sessions and progress
- **Symptom**: Database of possible symptoms
- **BodyPart**: Mapping of body parts to possible symptoms
- **Condition**: Medical conditions with related symptoms
- **Treatment**: General treatment information

### Implementation Steps

1. **Project Setup**
   - Initialize T3 stack application
   - Configure PostgreSQL database
   - Set up authentication with NextAuth.js

2. **Database Schema**
   - Define Prisma schema for data models
   - Create migrations
   - Seed initial symptom and condition data

3. **Core UI Components**
   - Layout and navigation
   - Multi-step form flow
   - Interactive body model component

4. **API Development**
   - tRPC routes for each step of the process
   - AI integration endpoints
   - Data persistence and retrieval

5. **Deployment**
   - Environment setup
   - Database provisioning
   - Application deployment

### Security and Compliance Considerations

- HIPAA compliance best practices
- Data encryption for sensitive information
- Clear terms of service and medical disclaimers 

## Database Schema

The database schema for SymptoTrack has been implemented in Prisma (`prisma/schema.prisma`). The following models have been defined:

### 1. User
Extends the NextAuth User model with additional medical profile fields:
- **id**: Unique identifier
- **email**: User's email (optional for anonymous sessions)
- **age**: User's age (optional)
- **sex**: User's biological sex (optional)
- Relations: Linked to accounts, sessions, tracking sessions, symptoms, and conditions

### 2. TrackingSession
Represents a symptom tracking session:
- **id**: Unique identifier
- **createdAt**: When the session was created
- **updatedAt**: When the session was last updated
- **currentStep**: Current stage in the 5-step process (info, symptoms, conditions, details, treatment)
- **completed**: Whether the session has been completed
- **userId**: User who owns this session
- Relations: Linked to user, symptoms, and conditions

### 3. BodyPart
Represents a part of the body in the interactive model:
- **id**: Unique identifier
- **name**: Name of the body part
- **svgId**: ID in the SVG model for interaction
- **description**: Description of the body part
- Relations: Linked to symptoms that can occur in this body part

### 4. Symptom
Represents a medical symptom:
- **id**: Unique identifier
- **name**: Name of the symptom
- **description**: Description of the symptom
- **severity**: Possible severity levels (mild, moderate, severe)
- **bodyPartId**: Body part where this symptom occurs
- Relations: Linked to body part, user symptoms, and conditions

### 5. UserSymptom
Links users to specific symptoms they're experiencing:
- **id**: Unique identifier
- **createdAt**: When the symptom was recorded
- **severity**: User-reported severity
- **duration**: How long the symptom has been present
- **notes**: Additional notes from the user
- Relations: Linked to user, symptom, and tracking session

### 6. Condition
Represents a medical condition:
- **id**: Unique identifier
- **name**: Name of the condition
- **description**: Description of the condition
- **treatmentInfo**: General treatment information
- **isSevere**: Whether the condition is severe
- Relations: Linked to symptoms and user conditions

### 7. SymptomCondition
Maps symptoms to conditions with relevance score:
- **id**: Unique identifier
- **relevance**: How relevant this symptom is for the condition (0.0-1.0)
- Relations: Linked to symptom and condition

### 8. UserCondition
Links users to potential conditions based on their symptoms:
- **id**: Unique identifier
- **createdAt**: When the condition was suggested
- **confidenceScore**: AI-generated confidence score (0.0-1.0)
- **userConfirmed**: User feedback if diagnosis was accurate
- **notes**: Additional notes
- Relations: Linked to user, condition, and tracking session

## UI Components

We've implemented the core UI components for SymptoTrack:

### 1. Layout Component
Located in `src/app/layout.tsx`, this component provides the application shell:
- **Header**: Contains the SymptoTrack logo and name with navigation links
- **Main Content Area**: Flexible container for page content
- **Footer**: Contains a medical disclaimer and copyright information
- **Styling**: Uses Tailwind CSS for responsive design with light/dark mode support

### 2. ProgressBar Component
Located in `src/app/_components/ProgressBar.tsx`, this component visualizes the 5-step process:
- **Step Indicators**: Numbered circles (1-5) representing each step
- **Current Step Highlighting**: Teal underline and ring highlight for the current step
- **Completed Steps**: Filled teal background for completed steps
- **Progress Line**: Horizontal line showing overall progress
- **Interactive**: Optional click navigation between steps

### 3. StepNavigation Component
Located in `src/app/_components/StepNavigation.tsx`, this component handles navigation between steps:
- **Previous Button**: Arrow icon with "Previous" text, disabled on first step
- **Continue Button**: "Continue" text with arrow icon (changes to "Finish" on the last step)
- **Conditional Styling**: Visual cues for disabled/enabled states
- **Event Handling**: Callbacks for previous/next navigation

### 4. Home Page Demo
Located in `src/app/page.tsx`, this page demonstrates the components working together:
- **Step State Management**: Uses React state to track current step
- **Step Content**: Conditionally renders content based on current step
- **Navigation Logic**: Implements previous/next logic with boundary handling
- **Responsive Container**: Properly styled container that adapts to different screen sizes

All components are built with TypeScript for type safety and Tailwind CSS for styling. The UI follows a clean, medical-appropriate color scheme with teal as the primary color.

## Information Screen Implementation

The Information Screen has been implemented in `src/app/page.tsx` as the first step in the SymptoTrack application flow:

### 1. Visual Elements
- **App Title**: "SymptoTrack" heading with a professional appearance
- **Tagline**: "Track your symptoms, understand your health" in teal color
- **Description**: Clear explanation of the tool's purpose
- **Medical Disclaimer**: Blue notification box with important medical disclaimer text

### 2. Form Components
- **Age Input**: Number input field with validation for the range 0-120
- **Sex Selection**: Radio button group with options for Male, Female, and Other
- **Continue Button**: Teal button with arrow icon, enabled only when form is valid

### 3. Form Validation
- Implemented using React Hook Form library
- Age field validates:
  - Required field
  - Must be between 0 and 120
  - Must be a number
- Sex field validates:
  - One option must be selected

### 4. User Experience
- Real-time validation feedback with error messages
- Visual indication of error states
- Continue button disabled until all fields are valid
- Smooth workflow into next step upon submission

### 5. Technical Implementation
- Used React Hook Form for form state management and validation
- Form values ready to be persisted to database/context for later use
- Responsive design that works on mobile and desktop
- Dark mode support for accessibility

### Challenges and Solutions
1. **TypeScript Integration**: Ensured proper typing for form values with defined interfaces
2. **Form State Management**: Used React Hook Form's `useForm` hook for controlled inputs
3. **Conditional Rendering**: Only showing the StepNavigation component on non-info screens
4. **Validation Logic**: Implemented comprehensive validation rules with helpful error messages

## Interactive Body Model Implementation

The interactive body model has been implemented to allow users to select body parts and associated symptoms:

### 1. Component Structure
- **BodyModel** (`src/app/_components/BodyModel.tsx`): Main interactive body component
- **SymptomsScreen** (`src/app/_components/SymptomsScreen.tsx`): Container for the symptom selection step

### 2. Technical Approach
- Utilized `reactjs-human-body` library for the SVG-based body model
- Enhanced with symptom selection functionality via modal dialogs
- Integrated with React's state management for tracking selections
- Fully responsive design that works on mobile and desktop devices

### 3. Body Part Interaction
- Body parts are clickable and highlight on hover
- Clicking a body part opens a modal with relevant symptoms
- Selected body parts remain highlighted to show active selections
- Interactive SVG elements map to specific body regions

### 4. Symptom Selection Features
- **Modal Interface**: Clean modal appears when body part is selected
- **Tabbed Navigation**: "Common" and "All" tabs for organizing symptoms
- **Search Functionality**: Filter symptoms with real-time search
- **Severity Selection**: Choose between mild, moderate, and severe for each symptom
- **Visual Feedback**: Color-coded severity levels (yellow/orange/red)

### 5. Data Organization
- Symptoms are organized by body part (head, chest, arms, legs, etc.)
- Each body part has common and comprehensive symptom lists
- Symptoms include names, descriptions, and severity options
- Data structure allows easy extension for additional symptoms

### 6. User Experience Enhancements
- **Summary View**: Shows all selected symptoms in a summary list
- **Selection Persistence**: Maintains selections between navigation steps
- **Searchable Symptoms**: Quick filtering of available symptoms
- **Clear Visual Hierarchy**: Easy to understand what's selected and where

### 7. Technical Implementation Details
- Used TypeScript interfaces for type safety
- Implemented custom state management for symptom selections
- Utilized React Hooks for component lifecycle management
- Designed for responsive behavior across device sizes

### 8. Integration with Application Flow
- Seamless integration with the multi-step process
- Data persistence between steps
- Selection data used in subsequent steps for condition analysis

### 9. Styled Components Integration
- Added styled-components to support the reactjs-human-body library
- Created a StyledComponentsRegistry for proper server-side rendering
- Configured Next.js compiler to optimize styled-components
- Added TypeScript declarations to ensure type safety
- Fixed version compatibility issues with legacy peer dependencies

### 10. Troubleshooting
- **Build Error**: "Module not found: Can't resolve 'styled-components'"
  - Solution: Installed styled-components with legacy-peer-deps flag
  - Added proper Next.js configuration for styled-components
  - Created a server-side rendering registry
- **TypeScript Errors**: Type definitions missing for external libraries
  - Solution: Added type declarations for reactjs-human-body
  - Installed @types/styled-components and @types/react-modal
  - Created custom type definitions when needed

## Symptoms Input Screen Implementation

The Symptoms Input Screen has been implemented in `src/app/symptoms/page.tsx` to provide a comprehensive interface for symptom entry:

### 1. Component Structure
- **SymptomsPage** (`src/app/symptoms/page.tsx`): Main page container
- **SymptomSearch** (`src/app/_components/SymptomSearch.tsx`): Text-based symptom search with autocomplete
- **SelectedSymptomsList** (`src/app/_components/SelectedSymptomsList.tsx`): Display and management of selected symptoms
- **SymptomsScreen**: Integration with the interactive body model

### 2. Dual Input Methods
- **Text Search**: Direct text entry with autocomplete suggestions
- **Body Model**: Visual body part selection with related symptoms
- Both methods feed into a unified symptoms list

### 3. Text-Based Symptom Search
- Autocomplete dropdown with symptom suggestions
- Search by symptom name or description
- Detailed symptom information displayed upon selection
- Severity selection for each symptom (mild/moderate/severe)

### 4. Selected Symptoms Management
- Grouping of symptoms by body part
- Visual indication of severity with color coding
- Ability to remove individual symptoms
- Compact display with scrollable container for many symptoms

### 5. State Management
- Client-side state management with React useState
- Persistent storage using localStorage to maintain selections across page refreshes
- Deduplication logic to prevent adding the same symptom twice
- Merging logic for symptoms from both input methods

### 6. User Experience
- Split-screen layout with search on the left and body model on the right
- Responsive design that adapts to mobile and desktop screens
- Visual feedback for current selections
- Navigation controls to move between application steps

### 7. Technical Implementation
- Component composition for maintainable code
- TypeScript interfaces for type safety
- React hooks for state and lifecycle management
- Efficient rendering with conditional displays

## Conditions Results Screen Implementation

The Conditions Results Screen has been implemented in `src/app/conditions/page.tsx` to display potential conditions based on the user's symptoms:

### 1. Component Structure
- **ConditionsPage** (`src/app/conditions/page.tsx`): Main page container
- **SummaryPanel** (`src/app/_components/SummaryPanel.tsx`): User info and symptom summary
- **ConditionCard** (`src/app/_components/ConditionCard.tsx`): Individual condition display
- **ConditionDetails** (`src/app/_components/ConditionDetails.tsx`): Modal for detailed condition info
- **ConditionsFilter** (`src/app/_components/ConditionsFilter.tsx`): Sorting and filtering controls

### 2. Layout and Information Architecture
- **Two-Column Layout**: Summary on the left, conditions list on the right
- **Responsive Design**: Stacks on mobile, side-by-side on desktop
- **Visual Hierarchy**: Clear distinction between main content and supporting information
- **Contextual Notifications**: Yellow banner appears when more input would be helpful

### 3. Condition Display Features
- **Condition Cards**: Each condition displayed in a card with key information
- **Confidence Indicators**: Visual and numeric representation of match confidence
- **Severity Highlighting**: Red border and label for potentially serious conditions
- **Quick Stats**: Number of symptoms and treatments at a glance
- **View Details Button**: Opens modal with comprehensive condition information

### 4. Condition Details Modal
- **Comprehensive Information**: Full details on selected condition
- **Structured Sections**: Description, symptoms, causes, treatments, etc.
- **"When to See a Doctor"**: Highlighted section for urgent health concerns
- **Scrollable Content**: Handles lengthy condition information elegantly
- **Persistent Header/Footer**: Easy navigation and context within the modal

### 5. Sorting and Filtering
- **Sort Options**: By confidence, severity, or alphabetically
- **Filter Options**: All conditions, serious conditions only, or common conditions
- **Status Indicator**: Shows number of filtered results vs. total conditions
- **Empty State**: Helpful message when no conditions match current filters
- **Responsive Controls**: Adapts to different screen sizes

### 6. Summary Panel
- **User Demographics**: Displays age and sex information
- **Symptom Summary**: Shows all reported symptoms grouped by body part
- **Action Buttons**: Edit symptoms or start over
- **Compact Display**: Scrollable list for many symptoms

### 7. State Management
- **Local Storage Integration**: Loads user info and symptoms from previous steps
- **Memoized Calculations**: Optimized filtering, sorting, and condition selection
- **Modal State**: Tracks which condition details are being viewed
- **Filter State**: Maintains current sorting and filtering preferences

### 8. User Experience Enhancements
- **Loading State**: Spinner while analyzing symptoms
- **Error Handling**: Friendly error messages with retry option
- **Conditional UI Elements**: Only shows elements when relevant
- **Visual Feedback**: Color coding for severity and confidence
- **Logical Navigation**: Clear next/previous buttons for workflow

### 9. Technical Implementation
- **Component Composition**: Clean separation of concerns
- **TypeScript Interfaces**: Strong typing for all data structures
- **React Hooks**: useState, useEffect, and useMemo for efficient state management
- **Conditional Rendering**: Dynamic UI based on current state
- **AI Integration**: Uses the OpenAI API for symptom analysis

### 10. Performance Considerations
- **Lazy Loading**: Modal only renders when needed
- **Memoization**: Avoids unnecessary recalculations
- **Efficient Rendering**: Only updates what changes
- **Responsive Images**: Optimized for different screen sizes
- **Minimal Dependencies**: Keeps bundle size small

## AI Symptom Analysis Implementation

The AI symptom analysis feature has been implemented to provide medical insights based on reported symptoms:

### 1. AI Service Integration
- **OpenAI GPT-4 Integration**: Leveraging advanced language model capabilities for symptom analysis
- **Environment Variables**: Secure storage of API keys in .env file with schema validation
- **API Client Setup**: Configuration of the OpenAI client with proper authentication

### 2. Prompt Engineering
- **System Prompt**: Detailed instructions for the AI to ensure medical accuracy and structured outputs
- **Clear Guidelines**: Specific rules for symptom correlation, confidence scoring, and severity flagging
- **Medical Disclaimers**: Explicit instructions to include proper medical disclaimers
- **Structured Output**: JSON schema definition for consistent response formatting

### 3. API Architecture
- **Utils Layer** (`src/utils/ai.ts`): Core AI functionality with type definitions and OpenAI interaction
- **API Endpoint** (`src/app/api/analyze-symptoms/route.ts`): Server-side endpoint for symptom analysis
- **Client Service** (`src/services/symptomAnalysisService.ts`): Frontend service for API communication

### 4. Performance Optimization
- **Caching System**: In-memory cache implementation to reduce duplicate API calls
- **Rate Limiting**: Both client-side and server-side rate limiting to manage API usage
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Response Formatting**: Consistent parsing and typing of AI responses

### 5. Data Structure
- **Symptom Input Format**: Organized by body part with severity indicators
- **Condition Output Format**: Structured data with confidence scores, descriptions, and treatment approaches
- **TypeScript Interfaces**: Strong typing throughout the system to ensure data consistency

### 6. Security Measures
- **Server-Side API Calls**: API keys never exposed to the client
- **Input Validation**: Thorough validation of all user inputs before processing
- **Rate Limiting by IP**: Protection against abuse with per-IP request limits
- **Error Masking**: Prevention of sensitive information leakage in error messages

### 7. User Experience
- **Loading State**: Clear visual feedback during API processing
- **Error Recovery**: Graceful error handling with retry capabilities
- **Results Presentation**: Well-organized display of AI analysis with severity highlighting
- **Confidence Indication**: Transparent confidence scoring for each suggested condition

### 8. Response Content
- **Potential Conditions**: List of possible conditions based on reported symptoms
- **Confidence Scoring**: Numerical likelihood of each condition
- **Severity Flags**: Highlighting of potentially serious conditions
- **Treatment Approaches**: General treatment information for each condition
- **When to See a Doctor**: Clear guidance on when to seek professional medical help
- **Medical Disclaimer**: Explicit statement about the limitations of AI-generated advice 

## Condition Details Screen Implementation

The Condition Details Screen has been implemented as a dedicated page for each condition with dynamic routing at `src/app/conditions/[id]/page.tsx`:

### 1. Component Structure
- **ConditionDetailsPage**: A comprehensive page to display detailed information about a specific condition
- **Dynamic Routing**: Uses Next.js dynamic routing with [id] parameter to display specific condition data
- **Navigation Controls**: Allows users to move between multiple conditions or return to the conditions list

### 2. Data Handling
- **LocalStorage Integration**: Retrieves the condition data from the saved AI analysis results
- **Condition Selection**: Shows the selected condition and provides navigation to other conditions
- **Error Handling**: Redirects to the conditions page if the requested condition doesn't exist

### 3. UI Organization
- **Condition Header**: Displays the condition name, confidence score, and severity indicator
- **Description Section**: Comprehensive explanation of the condition
- **Symptoms Section**: Lists all symptoms associated with the condition
- **Risk Factors Section**: Displays potential risk factors for developing the condition (when available)
- **Possible Causes Section**: Shows possible causes of the condition (when available)
- **Treatment Preview**: Provides a preview of treatment approaches with a button to proceed to detailed recommendations
- **When to See a Doctor Section**: Highlights important warning signs that require medical attention
- **External Resources**: Links to authoritative medical resources for additional information

### 4. Navigation Features
- **Condition Navigation**: Previous/Next buttons to navigate between matched conditions
- **Progress Tracking**: Shows current condition position (e.g., "Condition 2 of 5")
- **Workflow Navigation**: Buttons to return to conditions list or proceed to treatment recommendations

### 5. Sharing and Exporting
- **Share Button**: Allows sharing the condition information via the Web Share API
- **Download Option**: Export condition details as a text file (with option to implement PDF in the future)
- **Save to Profile**: Simulated functionality to save condition information to a user profile

### 6. User Experience
- **Loading State**: Shows a loading spinner while retrieving condition data
- **Responsive Design**: Fully responsive layout that works on mobile and desktop
- **Accessibility**: Semantic HTML structure with proper ARIA attributes
- **Visual Cues**: Color-coding for severity and informational hierarchies

### 7. Information Architecture
- **Logical Grouping**: Related information grouped into distinct sections
- **Progressive Disclosure**: Most important information displayed prominently
- **Consistent Style**: Maintains the application's design language
- **Emphasis on Action**: Clear calls-to-action for next steps

### 8. Integration with Overall Flow
- **Progress Bar**: Shows "DETAILS" as the current step in the user journey
- **Consistent Navigation**: Maintains the step-based navigation pattern
- **Data Continuity**: Uses the same condition data from the AI analysis

The Condition Details Screen provides users with comprehensive information about each potential condition matched to their symptoms, allowing them to make informed decisions about next steps and potential treatments. 

## Treatment Screen Implementation

The Treatment Screen has been implemented as the final step in the SymptoTrack user flow in `src/app/treatment/page.tsx`:

### 1. Component Structure
- **TreatmentPage**: The main page component that presents treatment recommendations
- **TreatmentCategory**: Reusable component for displaying categorized treatments (medications, lifestyle changes, procedures)
- **DoctorFinder**: Component for locating healthcare providers based on condition and location
- **TreatmentActions**: Component providing save/print/share options for treatment reports

### 2. Treatment Organization
- **Categorized Approach**: Treatments are intelligently categorized into:
  - Medications: Pharmaceuticals and drug-based treatments
  - Lifestyle Changes: Diet, exercise, and habit modifications
  - Medical Procedures: Surgeries, therapies, and clinical treatments
  - Other Recommendations: General advice not fitting the other categories
- **Visual Differentiation**: Each category has unique colors and icons for easy recognition
- **Empty State Handling**: Graceful fallbacks when no treatments are available in a category

### 3. Medical Guidance Features
- **When to See a Doctor Section**: Highlighted section with urgency indicators for seeking medical help
- **Emergency Warning**: Prominent notice for potentially life-threatening symptoms requiring immediate attention
- **Medical Disclaimers**: Comprehensive disclaimers about the educational nature of the information

### 4. Healthcare Provider Locator
- **Provider Search**: ZIP code-based search for nearby healthcare providers
- **Distance Configuration**: Adjustable search radius for finding care
- **Specialty Filtering**: Options to find specialists relevant to the condition
- **Facility Cards**: Displays information about medical facilities including ratings, distance, and contact details

### 5. Report Generation and Sharing
- **Print Functionality**: Well-formatted printable report with all treatment information
- **Download Option**: Export as text file with comprehensive details
- **Email Capability**: Send the treatment information via email
- **Web Share Integration**: Native sharing on supported platforms

### 6. Navigation Features
- **Previous/Next Flow**: Standard multi-step navigation between application sections
- **Back to Results**: Quick access back to the conditions list
- **Start Over**: Option to begin the process again

### 7. User Experience
- **Treatment Priority**: Treatments are displayed based on condition confidence and relevance
- **Responsive Design**: Fully mobile-responsive layout with grid adjustments
- **Loading States**: Clean loading indicators during data processing
- **Condition Context**: Always visible context of which condition is being displayed

### 8. Technical Implementation
- **Component Composition**: Clean separation of concerns through specialized components
- **State Management**: Efficient React hooks for local state management
- **LocalStorage Integration**: Persistent storage of user data across steps
- **Intelligent Categorization**: Treatment text analysis for automatic categorization

The Treatment Screen provides the final piece of the user journey, offering actionable recommendations, connecting users with healthcare providers, and enabling them to save and share their treatment information. It completes the 5-step process of the SymptoTrack application in a way that's informative, visually appealing, and clinically responsible. 