# Authcord

A simple discord bot for providing TOTP and HOTP authentication.

## Features
- [x] Adding and removing 'accounts' (TOTP/HOTP secrets) via slash-commands
- [x] Getting TOTP/HOTP tokens via slash-commands
- [x] Autocompletion for account names in slash-commands
- [x] Secrets are encrypted at rest (in a MySQL DB) using AES-256-GCM
- [ ] Caching (planned)
- [ ] Accounts limited to specific roles (planned)
- [ ] Fancy embeds (planned)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
