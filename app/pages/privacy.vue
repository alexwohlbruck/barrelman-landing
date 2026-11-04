<template>
  <LegalPage
    title="Privacy Policy"
    updated="2026-11-04"
    description="What personal data Barrelman holds, why, for how long, and your rights over it."
  >
    <p>
      This policy explains what personal data Barrelman collects when you use the API, the console,
      the documentation and this website, and what we do with it. The controller is [LEGAL ENTITY],
      [ADDRESS]. You can reach us at
      <a href="mailto:support@barrelman.dev">support@barrelman.dev</a>.
    </p>

    <h2>What we collect</h2>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Why</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Email address</td>
          <td>To create your account, send sign-in codes, and contact you about the Service and billing.</td>
        </tr>
        <tr>
          <td>Name, profile picture and account id from Google, GitHub or GitLab, if you sign in with one</td>
          <td>To link that sign-in to your account.</td>
        </tr>
        <tr>
          <td>Passkeys (a public key and device name)</td>
          <td>To let you sign in without a code. Your private key never leaves your device.</td>
        </tr>
        <tr>
          <td>API keys, stored only as a hash with a short prefix and the last four characters</td>
          <td>To authenticate requests and let you tell your keys apart.</td>
        </tr>
        <tr>
          <td>A keyed hash (HMAC) of your IP address at sign-up and at each sign-in, and your browser's user agent for each session</td>
          <td>To detect abuse such as free-tier farming, and to show you your active sessions. We cannot recover your IP address from the hash.</td>
        </tr>
        <tr>
          <td>Per-request metrics: endpoint group, status, response time and the key used, aggregated by hour</td>
          <td>To operate and secure the Service, enforce rate limits, and investigate problems.</td>
        </tr>
        <tr>
          <td>Usage counters and a credit ledger</td>
          <td>To meter usage, apply your plan's allowance and bill you correctly.</td>
        </tr>
        <tr>
          <td>Your Polar customer id</td>
          <td>To link your account to your subscription and invoices.</td>
        </tr>
        <tr>
          <td>Records of moderation and abuse signals on your account</td>
          <td>To enforce the <a href="/acceptable-use">Acceptable Use Policy</a> and keep a record of what was done and why.</td>
        </tr>
        <tr>
          <td>Emails you send us</td>
          <td>To answer you.</td>
        </tr>
      </tbody>
    </table>
    <p>
      We do not store the content of your API requests, such as search text or coordinates, beyond
      what is needed to answer them. Short-lived server logs may hold request details for
      troubleshooting and are deleted on a rolling basis.
    </p>
    <p>
      Payment details are collected by Polar and its payment processors. We never see or store your
      card number.
    </p>

    <h2>Legal bases</h2>
    <p>If you are in the EU, the UK or a similar jurisdiction, we rely on these legal bases:</p>
    <ul>
      <li>
        <strong>Contract</strong>, for running your account, authenticating your requests, metering
        usage and billing.
      </li>
      <li>
        <strong>Legitimate interest</strong>, for security, abuse prevention, rate limiting and
        improving the Service. We keep this data minimal and hash identifiers where we can.
      </li>
      <li>
        <strong>Legal obligation</strong>, for keeping invoices and tax records.
      </li>
    </ul>

    <h2>How long we keep it</h2>
    <ul>
      <li>Per-request metrics are deleted after 90 days.</li>
      <li>Sign-in codes expire after 15 minutes and are then deleted.</li>
      <li>Sessions are deleted when they expire or when you sign out.</li>
      <li>Account data, keys, usage counters and the credit ledger are kept until your account is deleted.</li>
      <li>
        Invoices and payment records are kept by Polar for as long as tax and accounting law
        requires.
      </li>
      <li>
        Moderation records may be kept after an account is deleted where needed to prevent repeat
        abuse.
      </li>
    </ul>

    <h2>Who we share it with</h2>
    <p>We do not sell personal data. We share it only with the processors that run the Service:</p>
    <ul>
      <li>
        <strong>Hetzner Online GmbH</strong>, Germany, which hosts the API, the console and the
        database.
      </li>
      <li>
        <strong>Polar Software Inc.</strong>, our reseller and Merchant of Record, which handles
        checkout, payments, tax and invoices.
      </li>
      <li><strong>[EMAIL PROVIDER]</strong>, which delivers sign-in codes and account email.</li>
      <li><strong>Netlify, Inc.</strong>, which hosts this website and the documentation.</li>
    </ul>
    <p>
      This website loads its text fonts from Google Fonts. Your browser sends your IP address to
      Google when it fetches them.
    </p>
    <p>We may also disclose data when the law requires it.</p>

    <h2>International transfers</h2>
    <p>
      Our main servers are in the EU. Some processors, including Polar, Netlify and Google, are
      based in the United States. Where data leaves the EU or UK, we rely on the EU–US Data Privacy
      Framework where the recipient is certified, or on the European Commission's Standard
      Contractual Clauses.
    </p>

    <h2>Your rights</h2>
    <p>Depending on where you live, you have the right to:</p>
    <ul>
      <li>access the personal data we hold about you;</li>
      <li>correct it if it is wrong;</li>
      <li>have it deleted;</li>
      <li>receive it in a portable format;</li>
      <li>object to processing based on legitimate interest, or ask us to restrict it;</li>
      <li>lodge a complaint with your data protection authority.</li>
    </ul>
    <p>
      To use any of these rights, including deleting your account, email
      <a href="mailto:support@barrelman.dev">support@barrelman.dev</a> from the address on your
      account. We will answer within one month. You can see your keys, sessions and usage in the
      console at any time.
    </p>

    <h2>Cookies</h2>
    <p>
      The console sets a session cookie to keep you signed in. While you sign in, it may also set
      short-lived cookies that secure a passkey or a Google, GitHub or GitLab sign-in. All of these
      are needed for the console to work. We use no analytics, advertising or tracking cookies, and
      this website sets no cookies at all.
    </p>

    <h2>Children</h2>
    <p>
      The Service is for developers and businesses. It is not directed at children under 16, and we
      do not knowingly collect their data. If you believe a child has given us personal data, tell
      us and we will delete it.
    </p>

    <h2>Changes</h2>
    <p>
      We will update the date above when this policy changes. For a material change, we will email
      account holders before it takes effect.
    </p>

    <h2>Contact</h2>
    <p>
      Questions and requests go to
      <a href="mailto:support@barrelman.dev">support@barrelman.dev</a>.
    </p>
  </LegalPage>
</template>
