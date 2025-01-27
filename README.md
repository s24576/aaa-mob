# Lock.in Mobile Application

Lock.in is a social platform for League of Legends players, designed to help gamers find and connect with compatible teammates. This repository contains the mobile application version of Lock.in, built with React Native and Expo.

## Description

The Lock.in mobile app is part of a larger ecosystem that includes web and desktop applications. It provides League of Legends players with tools to:

- Find and connect with potential teammates
- Browse and share game builds
- Access educational content and courses
- Communicate through a built-in messaging system
- Track friend activities and manage relationships
- Monitor League of Legends profiles

## Technology Stack

- **Framework**: React Native with Expo
- **State Management**: React Query (@tanstack/react-query)
- **Navigation**: React Navigation
- **Real-time Communication**: STOMP WebSocket
- **Internationalization**: i18next
- **UI Components**: React Native Paper
- **Icons**: React Native Vector Icons
- **Styling**: NativeWind (Tailwind CSS for React Native)

## Features

- User authentication and profile management
- Real-time messaging and notifications
- Build browser and creation system
- Friend system with requests and management
- Riot Games account integration
- Match history viewing
- Educational content browser
- Duo finder system
- Multi-language support (English and Polish)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start using Expo Go:
```bash
npx expo start
```

## Project Structure

- `/screens` - Main application screens and views
- `/components` - Reusable React Native components
- `/api` - API integration and services
- `/context` - React Context providers
- `/types` - TypeScript type definitions
- `/translations` - i18n translation files
- `/styles` - Shared styles
- `/assets` - Images, fonts, and other static assets

## Development

This project follows a hybrid development methodology combining waterfall and agile approaches. The documentation was developed using a waterfall model, while implementation followed a more flexible approach.

### Environment Setup

Create a `.env` file in the root directory with the following variables:
```
BACKEND_ADDRESS=your_backend_url
```

## Backend Integration

The application connects to a Java Spring backend service. Key integration points include:
- REST API endpoints for data operations
- WebSocket connections for real-time features
- MongoDB database for data persistence

## Project Status

This project was developed as part of an engineering thesis at Polish-Japanese Academy of Information Technology. It demonstrates the implementation of a complex social platform for gamers using modern web technologies.

## License

This project is proprietary software owned by the Polish-Japanese Academy of Information Technology (PJATK). Unauthorized use, reproduction, or distribution is prohibited.

## Related Projects

- [Lock.in Web Application](https://github.com/s24576/aaa-web)
- [Lock.in Desktop Application](https://github.com/s24576/aaa-desktop)
- [Lock.in Backend Server](https://github.com/s24576/aaa-server)
