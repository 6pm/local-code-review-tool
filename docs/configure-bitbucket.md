# Configure Bitbucket


### Step 1: Access App Password Settings

1. Log in to your Bitbucket account 
2. Go to the [App Paswords settings](https://bitbucket.org/account/settings/app-passwords/)

### Step 2: Create New App Password

1. Click the **Create app password** button
2. Fill in the app password details:
   - **Label**: Give your app password a descriptive name (e.g., "Git Operations", "CI/CD Pipeline", "Local Development")
   - **Permissions**: Select the appropriate permissions based on your needs:

#### Common Permission Combinations:

**Repositories:**
- ✅ Read

**Pull requests:**
- ✅ Read


3. Click **Create** to generate the app password

### Step 3: Save Your App Password
Paste your password to .env file in the root of the project: 
BITBUCKET_APP_PASSWORD='your-app-password'

⚠️ **Important**: The app password will only be displayed once. Make sure to copy the generated password immediately and store securely.- 


### Step 4: Save Bitbucket username

Your Bitbucket username is the unique identifier for your account. You can find it here:
[Account settings](https://bitbucket.org/account/settings/)

Save to .env variable:
BITBUCKET_USERNAME='your-username'
