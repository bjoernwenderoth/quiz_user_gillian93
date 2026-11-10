"""Builds the PROJECT X invitation e-mail (HTML) with the login data from content.ts.

Usage: python3 scripts/invite.py  →  invite/project-x-einladung.html (git-ignored: contains the credentials)

E-mail HTML rules: tables + inline styles only, 600 px wide, no web fonts or CSS files, images as absolute
URLs (the QR code is served by GitHub Pages from public/invite/qr.png). Nothing hints at the birthday.
"""
import html, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
content = (root / 'src/features/quiz/content.ts').read_text()
email, password = re.search(r"access = \{ email: '([^']+)', password: '([^']+)' \}", content).groups()
site = 'https://bjoernwenderoth.github.io/quiz_user_gillian93/'
qr = site + 'invite/qr.png'

ground, card, line, ink, muted, gold, field = '#171916', '#1d201b', '#363a32', '#f3f0e8', '#a9ada3', '#dac49c', '#141613'
sans = "'Helvetica Neue', Helvetica, Arial, sans-serif"
e, p = html.escape(email), html.escape(password)

page = f'''<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<meta name="format-detection" content="telephone=no,address=no,email=no,date=no">
<style>a[x-apple-data-detectors]{{color:inherit!important;text-decoration:none!important;}}</style>
<title>PROJECT X · Dein persönlicher Zugang</title>
</head>
<body style="margin:0;padding:0;background:{ground};" bgcolor="{ground}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:{ground};">Dein persönlicher Zugang zu PROJECT X ist freigeschaltet.&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{ground}" style="background:{ground};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

  <!-- Header -->
  <tr><td style="padding:0 4px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="font-family:{sans};">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td width="34" height="34" align="center" valign="middle" style="border:1px solid #786e54;color:{gold};font-family:{sans};font-size:21px;font-weight:300;line-height:32px;">X</td>
          <td style="padding-left:12px;color:{ink};font-family:{sans};font-size:14px;font-weight:700;letter-spacing:2px;">PROJECT X</td>
        </tr></table>
      </td>
      <td align="right" style="color:{muted};font-family:{sans};font-size:11px;letter-spacing:1px;">PRIVATE ACCESS</td>
    </tr></table>
  </td></tr>

  <!-- Card -->
  <tr><td bgcolor="{card}" style="background:{card};border:1px solid {line};border-radius:14px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

      <tr><td style="padding:44px 40px 0;font-family:{sans};">
        <p style="margin:0;color:{gold};font-size:11px;letter-spacing:2px;">PERSÖNLICHE EINLADUNG &nbsp;·&nbsp; PX—010</p>
        <h1 style="margin:18px 0 0;color:{ink};font-family:{sans};font-size:34px;line-height:1.15;font-weight:500;letter-spacing:-0.5px;">Du wurdest<br><span style="color:{gold};">ausgewählt.</span></h1>
        <p style="margin:24px 0 0;color:{ink};font-size:16px;line-height:1.65;">Hallo Gillian,</p>
        <p style="margin:12px 0 0;color:{muted};font-size:15px;line-height:1.7;">dein persönlicher Zugang zu PROJECT X ist ab sofort freigeschaltet. Hinter zehn Fragen wartet etwas, das ausschließlich für dich bestimmt ist.</p>
      </td></tr>

      <!-- Button -->
      <tr><td style="padding:32px 40px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td bgcolor="{gold}" style="background:{gold};border-radius:10px;">
            <a href="{site}" target="_blank" style="display:inline-block;padding:17px 30px;color:#24271f;font-family:{sans};font-size:13px;font-weight:700;letter-spacing:1px;text-decoration:none;border-radius:10px;">ZUGANG ÖFFNEN &nbsp;→</a>
          </td>
        </tr></table>
      </td></tr>

      <!-- Credentials -->
      <tr><td style="padding:32px 40px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{field}" style="background:{field};border:1px solid {line};border-radius:10px;">
          <tr><td style="padding:20px 22px 6px;font-family:{sans};color:{muted};font-size:11px;letter-spacing:2px;">DEINE ZUGANGSDATEN</td></tr>
          <tr><td style="padding:8px 22px 0;font-family:{sans};">
            <p style="margin:0;color:{muted};font-size:12px;">E-Mail-Adresse</p>
            <p style="margin:4px 0 0;color:{ink};font-size:16px;font-weight:600;"><span style="color:{ink};text-decoration:none;">{e}</span></p>
          </td></tr>
          <tr><td style="padding:14px 22px 20px;font-family:{sans};">
            <p style="margin:0;color:{muted};font-size:12px;">Passwort</p>
            <p style="margin:4px 0 0;color:{gold};font-family:Menlo, Consolas, 'Courier New', monospace;font-size:18px;font-weight:600;letter-spacing:1px;">{p}</p>
          </td></tr>
        </table>
        <p style="margin:12px 0 0;font-family:{sans};color:{muted};font-size:12px;line-height:1.6;">Bitte gib deine Zugangsdaten nicht weiter. Der Zugang ist nur für dich bestimmt.</p>
      </td></tr>

      <!-- QR -->
      <tr><td style="padding:32px 40px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid {line};"><tr>
          <td width="132" valign="top" style="padding-top:28px;">
            <img src="{qr}" width="116" height="116" alt="QR-Code zu PROJECT X" style="display:block;width:116px;height:116px;border:0;border-radius:6px;">
          </td>
          <td valign="middle" style="padding:28px 0 0 18px;font-family:{sans};">
            <p style="margin:0;color:{ink};font-size:14px;font-weight:600;">Am Laptop?</p>
            <p style="margin:6px 0 0;color:{muted};font-size:13px;line-height:1.6;">Scanne den Code mit deinem Handy oder öffne den Link:</p>
            <p style="margin:8px 0 0;font-size:13px;"><a href="{site}" target="_blank" style="color:{gold};text-decoration:none;">{site.replace('https://', '').replace('.io/', '.io/<wbr>')}</a></p>
          </td>
        </tr></table>
      </td></tr>

      <!-- Rules -->
      <tr><td style="padding:32px 40px 44px;font-family:{sans};">
        <p style="margin:0;color:{muted};font-size:12px;line-height:1.9;letter-spacing:0.3px;"><span style="white-space:nowrap;">✓&nbsp; 10&nbsp;Fragen</span> &nbsp;&nbsp; <span style="white-space:nowrap;">✓&nbsp; Kein&nbsp;Zeitlimit</span> &nbsp;&nbsp; <span style="white-space:nowrap;">✓&nbsp; Dein&nbsp;Geheimnis</span></p>
        <p style="margin:6px 0 0;color:#edb8a5;font-size:12px;line-height:1.6;">Ein falscher Schlüssel – und alles beginnt von vorn.</p>
      </td></tr>

    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:24px 8px 0;font-family:{sans};color:#6d725f;font-size:11px;line-height:1.7;">
    PROJECT X &nbsp;/&nbsp; Das Beste bleibt verborgen.<br>
    Diese Nachricht wurde an {e} gesendet, weil du für PROJECT X ausgewählt wurdest.
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>
'''
out = root / 'invite' / 'project-x-einladung.html'
out.parent.mkdir(exist_ok=True)
out.write_text(page)
print('written', out.relative_to(root))
