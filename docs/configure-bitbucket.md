# Configure Bitbucket


### Step 1: Access App Password Settings

1. Log in to your Bitbucket account at [https://bitbucket.org](https://bitbucket.org)
2. Click on your profile avatar in the bottom-left corner
3. Select **Personal settings** from the dropdown menu
4. In the left sidebar, click on **App passwords** under the "Access management" section

### Step 2: Create New App Password

1. Click the **Create app password** button
2. Fill in the app password details:
   - **Label**: Give your app password a descriptive name (e.g., "Git Operations", "CI/CD Pipeline", "Local Development")
   - **Permissions**: Select the appropriate permissions based on your needs:

#### Common Permission Combinations:

**For Git Operations:**
- ✅ Repositories: Read
- ✅ Repositories: Write (if you need to push changes)

**For Repository Management:**
- ✅ Repositories: Read
- ✅ Repositories: Write
- ✅ Repositories: Admin (if you need full repository access)

**For Pull Requests:**
- ✅ Repositories: Read
- ✅ Repositories: Write
- ✅ Pull requests: Read
- ✅ Pull requests: Write

**For Issues and Project Management:**
- ✅ Issues: Read
- ✅ Issues: Write
- ✅ Projects: Read

3. Click **Create** to generate the app password

### Step 3: Save Your App Password

⚠️ **Important**: The app password will only be displayed once. Make sure to:
- Copy the generated password immediately
- Store it securely (use a password manager)
- Never share it or commit it to version control

## Configuring Username and App Password

### Your Bitbucket Username

Your Bitbucket username is the unique identifier for your account. You can find it:

1. In your Bitbucket profile URL: `https://bitbucket.org/{username}`
2. In your account settings under "Profile settings"
3. It's usually displayed in the top-right corner when you're logged in

### Environment Variables (Recommended)

Set up environment variables to avoid hardcoding credentials:

```bash
# Add to your ~/.bashrc, ~/.zshrc, or ~/.profile
export BITBUCKET_USERNAME="your-username"
export BITBUCKET_APP_PASSWORD="your-app-password"
```

### Configuration Files

For applications that support configuration files, create a secure config:

```yaml
# config.yml (example)
bitbucket:
  username: "${BITBUCKET_USERNAME}"
  app_password: "${BITBUCKET_APP_PASSWORD}"
```

## Using App Password with Git

### Method 1: HTTPS Clone with Credentials

```bash
# Clone repository using app password
git clone https://your-username:your-app-password@bitbucket.org/workspace/repository.git

# Or set up credential helper (recommended)
git config --global credential.helper store
git clone https://bitbucket.org/workspace/repository.git
# Enter username and app password when prompted
```

### Method 2: Configure Git Credential Helper

#### For macOS (Keychain):
```bash
git config --global credential.helper osxkeychain
```

#### For Windows (Credential Manager):
```bash
git config --global credential.helper manager-core
```

#### For Linux (Store):
```bash
git config --global credential.helper store
```

### Method 3: Remote URL with Embedded Credentials

```bash
# Set remote URL with embedded credentials
git remote set-url origin https://your-username:your-app-password@bitbucket.org/workspace/repository.git
```

### Method 4: Using .netrc File (Unix/Linux/macOS)

Create a `~/.netrc` file:

```
machine bitbucket.org
login your-username
password your-app-password
```

Set appropriate permissions:
```bash
chmod 600 ~/.netrc
```

## Best Practices

### Security

1. **Use Minimal Permissions**: Only grant the permissions your application actually needs
2. **Unique Passwords**: Create separate app passwords for different applications/purposes
3. **Regular Rotation**: Rotate app passwords periodically (every 3-6 months)
4. **Secure Storage**: Use environment variables or secure credential managers
5. **Revoke Unused Passwords**: Remove app passwords that are no longer needed

### Naming Convention

Use descriptive labels for your app passwords:
- `local-git-development`
- `ci-cd-github-actions`
- `backup-script-server`
- `mobile-app-api-access`

### Documentation

Keep track of:
- Which app passwords are used where
- When they were created
- When they expire (if applicable)
- Who has access to them

## Troubleshooting

### Common Issues

#### Authentication Failed
```
remote: Invalid username or password
```

**Solutions:**
1. Verify your username is correct
2. Ensure you're using the app password, not your regular password
3. Check that the app password has the required permissions
4. Verify the app password hasn't been revoked

#### Permission Denied
```
remote: Permission denied (publickey)
```

**Solutions:**
1. Make sure you're using HTTPS, not SSH
2. Check that your app password has the correct repository permissions
3. Verify the repository URL is correct

#### URL Format Issues
```
fatal: repository not found
```

**Solutions:**
1. Ensure the URL format is correct: `https://bitbucket.org/workspace/repository.git`
2. Verify you have access to the repository
3. Check if the repository name or workspace is correct

### Testing Your Configuration

Test your app password configuration:

```bash
# Test with curl
curl -u your-username:your-app-password https://api.bitbucket.org/2.0/user

# Test with git (clone a small repository)
git clone https://your-username:your-app-password@bitbucket.org/workspace/test-repo.git
```

### Getting Help

If you continue to experience issues:

1. Check the [Bitbucket Support Documentation](https://support.atlassian.com/bitbucket-cloud/)
2. Verify your account status and permissions
3. Contact your workspace administrator if you're part of a team
4. Review Bitbucket's API rate limits if using programmatic access

## Security Considerations

### What NOT to Do

❌ **Never commit app passwords to version control**
❌ **Don't share app passwords via insecure channels**
❌ **Avoid using overly broad permissions**
❌ **Don't use your main account password for applications**

### What TO Do

✅ **Use environment variables for credentials**
✅ **Implement proper secret management**
✅ **Regularly audit and rotate passwords**
✅ **Use least-privilege principle**
✅ **Monitor access logs and usage**

---

## Additional Resources

- [Bitbucket App Passwords Official Documentation](https://support.atlassian.com/bitbucket-cloud/docs/app-passwords/)
- [Git Credential Helpers](https://git-scm.com/docs/gitcredentials)
- [Bitbucket REST API Documentation](https://developer.atlassian.com/bitbucket/api/2/reference/)

---

*Last updated: [Current Date]*
*Version: 1.0*
