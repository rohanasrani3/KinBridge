# KinBridge mobile app

The Android app for parents enrolled in Parenting Foundations, built with Expo (React Native). It works on iOS from the same code later.

## Try it on your phone

1. Install **Expo Go** from the Play Store.
2. On your computer, in this folder:
   ```
   npm install
   npx expo start
   ```
3. Scan the QR code with Expo Go. Phone and computer need to be on the same Wi-Fi.

## What's in it

| Screen | File |
| --- | --- |
| Welcome: language, name, enrolment code, goal | `src/app/onboarding.tsx` |
| Today: home goal, week strip, reflection, next session | `src/app/(tabs)/today.tsx` |
| Practice: daily log history | `src/app/(tabs)/practice.tsx` |
| Log practice | `src/app/log.tsx` |
| Weekly reflection (3 steps) | `src/app/reflection.tsx` |
| Check-ins and the questionnaire | `src/app/checkins.tsx`, `src/app/checkin/[measure].tsx` |
| Progress: before/after, practice calendar, skills | `src/app/(tabs)/progress.tsx` |
| Kiu chat | `src/app/(tabs)/kiu.tsx`, `src/kiu.ts` |
| Settings | `src/app/settings.tsx` |

Content lives in `src/content.ts` (lessons, skills), `src/measures.ts` (questionnaires) and `src/i18n.ts` (all English and Chinese UI text).

## Before launch

- **Questionnaire wording.** `src/measures.ts` has only the example statements. Every item marked `pending` needs its licensed wording and licensed Chinese translation. Confirm the BPSES response scale too.
- **Programme details.** `src/config.ts`: session times and venue, intake form link.
- **Enrolment codes** are not checked yet. Any code of 4+ characters is accepted (`src/app/onboarding.tsx`).
- **Data stays on the phone.** Logs, reflections and check-in answers are saved on the device only (`src/store.tsx`). To see participants' data, the app needs a backend. Every change goes through `update()` in `src/store.tsx`, so that's where syncing goes. A privacy notice (PDPO) is needed before collecting this data.
- **Chinese text** was written for this prototype. Have a native speaker review it.

## Checks

```
npx tsc --noEmit
npx expo lint
npx expo-doctor
```

## Building an installable APK

- In the cloud: `npx eas-cli@latest build -p android --profile preview` (needs a free Expo account).
- Locally: `npx expo run:android --variant release` (needs Android Studio's JDK and the Android SDK/NDK; the first build downloads a lot).
