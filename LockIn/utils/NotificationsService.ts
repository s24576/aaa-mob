import { Notifications } from 'react-native-notifications'

export const initializeNotifications = () => {
  Notifications.registerRemoteNotifications()

  Notifications.events().registerNotificationReceivedForeground(
    (notification, completion) => {
      console.log('Notification Received - Foreground', notification)
      completion({ alert: true, sound: true, badge: false })
    }
  )

  Notifications.events().registerNotificationOpened(
    (notification, completion) => {
      console.log('Notification Opened', notification)
      completion()
    }
  )

  Notifications.events().registerRemoteNotificationsRegistered((event) => {
    console.log('Device Token:', event.deviceToken)
  })

  Notifications.events().registerRemoteNotificationsRegistrationFailed(
    (event) => {
      console.error('Device Token Registration Failed:', event)
    }
  )
}
