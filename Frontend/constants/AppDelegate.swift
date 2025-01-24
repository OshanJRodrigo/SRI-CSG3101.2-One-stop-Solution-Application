import Firebase

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        FirebaseApp.configure()

        // Optionally set API Key manually
        if let options = FirebaseApp.app()?.options {
            options.apiKey = "AIzaSyCZ7mB-9MFf195Y56FgpRUHUxV6H765gpo" // Replace with your API Key
        }

        return true
    }
}
