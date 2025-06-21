# Hostinger SMTP Setup Guide for support@homekrypto.com

## Quick Steps to Enable SMTP Access:

1. **Login to Hostinger:** Go to hostinger.com → Login
2. **Find Email Settings:** Hosting → homekrypto.com → Email Accounts
3. **Manage Email:** Click "Manage" next to support@homekrypto.com
4. **Enable SMTP:** Look for "IMAP/SMTP Configuration" and turn it ON
5. **Save Settings:** Make sure to save the changes

## Detailed Steps:

### Step 1: Access Hostinger Control Panel
- Go to [hostinger.com](https://hostinger.com)
- Login with your account credentials
- Navigate to "Hosting" section

### Step 2: Find Email Configuration
- Click on your domain (homekrypto.com)
- Look for "Email Accounts" or "Email" in the menu
- Find the email: support@homekrypto.com

### Step 3: Enable SMTP Access
- Click "Manage" or the gear icon next to your email
- Look for one of these sections:
  - "Email Client Configuration"
  - "IMAP/SMTP Settings" 
  - "External Email Client"
  - "Mail Client Setup"
- **IMPORTANT:** Enable/Turn ON IMAP and SMTP access

5. **Verify SMTP Settings:**
   - **Incoming (IMAP):**
     - Server: `imap.hostinger.com`
     - Port: `993` (SSL) or `143` (TLS)
   
   - **Outgoing (SMTP):**
     - Server: `smtp.hostinger.com`
     - Port: `465` (SSL) or `587` (TLS)
     - Authentication: Required
     - Username: `support@homekrypto.com`
     - Password: `Masterdominikana32$`

## Step 2: Check Email Security Settings

1. **Two-Factor Authentication:**
   - If 2FA is enabled on your email, you may need to generate an "App Password"
   - Look for "App Passwords" or "Application-specific passwords"

2. **Less Secure Apps:**
   - Some providers require enabling "Less secure app access"
   - Check if this setting exists and enable it

## Step 3: Alternative SMTP Ports

If port 465 doesn't work, try:
- **Port 587** with TLS (StartTLS)
- **Port 25** (if not blocked by hosting provider)

## Step 4: Test Email Delivery

After enabling SMTP access:
1. The registration should automatically send verification emails
2. Check spam/junk folder if emails don't appear in inbox
3. Verify the email address `support@homekrypto.com` is properly configured

## Troubleshooting

**If emails still don't work:**

1. **Check email quota** - ensure mailbox isn't full
2. **Verify domain DNS** - MX records should point to Hostinger
3. **Try different ports** - 587 with TLS instead of 465 with SSL
4. **Contact Hostinger support** - they can verify SMTP is enabled on your account

**Common Issues:**
- "Authentication failed" = wrong password or SMTP not enabled
- "Connection timeout" = port blocked or wrong server
- "Relay access denied" = authentication required but not provided

Let me know once you've enabled SMTP access in your Hostinger panel, and I'll test the email system again.