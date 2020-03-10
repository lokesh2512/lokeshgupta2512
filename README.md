# Wire Bot GitHub Action

## Usage

```yaml
- name: Wire Bot GitHub Action
  uses: lipis/wire-bot-github-action@v1
  with:
    email: ${{secrets.WIRE_BOT_EMAIL}}
    password: ${{secrets.WIRE_BOT_PASSWORD}}
    conversation: '123456789'
    text: 'Hello, World!'
```
