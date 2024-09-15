## Vora Wallet
Vora Wallet is envisioned as a Wallet as a Service (WaaS) platform on Aztec where the Private Execution Environment is run on 
the cloud by the Wallet Provider and users can sign in to their individual wallets for secure sessions using a passkey.
The private key of the passkey is stored locally on the user's device and follows the FIDO2 standard.
That means that authentication can be performed through TouchID on iPhones, Fingerprint verification or through patterns on Android
devices or through a hardway usb key like Yubikey or any other WebAuthn compliant device.

The PXE service is run on the server and utilizes user scoped sessions.

