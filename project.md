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
- OpenAI/Anthropic API integration
- Symptom-to-condition mapping with confidence scores
- Medical knowledge database to supplement AI responses
- Responsible disclaimers about medical advice

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