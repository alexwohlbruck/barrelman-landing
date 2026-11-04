<template>
  <LegalPage
    title="Service Level Agreement"
    updated="2026-11-04"
    description="The uptime Barrelman commits to on each paid plan, and the credits owed when it falls short."
  >
    <p>
      This agreement takes effect on [EFFECTIVE DATE]. It forms part of the
      <a href="/terms">Terms of Service</a> and sets out the uptime we commit to for each plan, how
      it is measured, and what you receive when we miss it.
    </p>

    <h2>1. Uptime targets</h2>
    <table>
      <thead>
        <tr>
          <th>Plan</th>
          <th>Monthly uptime target</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Free</td>
          <td>No SLA. Best effort.</td>
        </tr>
        <tr>
          <td>Developer</td>
          <td>No SLA. Best effort.</td>
        </tr>
        <tr>
          <td>Business</td>
          <td>99.5%</td>
        </tr>
        <tr>
          <td>Scale</td>
          <td>99.9%</td>
        </tr>
        <tr>
          <td>Enterprise</td>
          <td>As set out in your agreement</td>
        </tr>
      </tbody>
    </table>

    <h2>2. How uptime is measured</h2>
    <p>
      Uptime is measured per calendar month and per endpoint group (search, geocoding, tiles,
      routing and so on, as listed on the <a href="/status">status page</a>). Two sources count:
    </p>
    <ul>
      <li>
        an external probe of <code>api.barrelman.dev/health</code>, which reports the status of
        each endpoint group;
      </li>
      <li>real requests to each endpoint group, where a request fails if the API answers with a
        5xx error or does not answer at all.</li>
    </ul>
    <p>
      Monthly uptime for an endpoint group is the share of minutes in the month in which it was
      available by both measures. A request refused for a reason on your side, such as an invalid
      key, an exhausted allowance or a rate limit, is not a failure.
    </p>

    <h2>3. Exclusions</h2>
    <p>The following do not count as downtime:</p>
    <ul>
      <li>
        scheduled maintenance announced on the status page at least 48 hours ahead, up to 4 hours
        in a month;
      </li>
      <li>
        problems caused by you, your code, your network or your use of the Service against the
        Terms or the <a href="/acceptable-use">Acceptable Use Policy</a>;
      </li>
      <li>events outside our reasonable control (force majeure);</li>
      <li>endpoints marked as beta in the documentation.</li>
    </ul>

    <h2>4. Service credits</h2>
    <p>
      If an endpoint group your plan uses falls below its target in a month, you are owed a credit
      against that month's plan fee:
    </p>
    <table>
      <thead>
        <tr>
          <th>Monthly uptime</th>
          <th>Credit</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Below the plan's target</td>
          <td>10% of the monthly fee</td>
        </tr>
        <tr>
          <td>Below 99%</td>
          <td>25% of the monthly fee</td>
        </tr>
        <tr>
          <td>Below 95%</td>
          <td>50% of the monthly fee</td>
        </tr>
      </tbody>
    </table>

    <h2>5. Claiming a credit</h2>
    <p>
      Email <a href="mailto:support@barrelman.dev">support@barrelman.dev</a> within 30 days of the
      end of the affected month. Include your account email, the endpoint groups affected and,
      where you have them, the times and the <code>X-Request-Id</code> of failed requests. Claims
      made after 30 days are not accepted.
    </p>

    <h2>6. Sole remedy</h2>
    <p>
      Service credits are your sole and exclusive remedy for any failure to meet the targets in
      this agreement.
    </p>
  </LegalPage>
</template>
