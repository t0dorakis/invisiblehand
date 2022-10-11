import React from 'react';

const Text = () => (
  <article>
    <h3>Impressum</h3>
    <p>
      <span className="muted">Angaben gemäß § 5 TMG</span>
    </p>
    <p>
      Invisible Hand GbR <br />
      Karl-Marx-Straße 93 <br />
      12043 Berlin <br />
      vertreten durch Claudio Banti
    </p>
    <p>
      {/*<span className="small">Tel.:</span>*/}
      <a href="tel:+4915731661319">+49 (0) 157 316 613 19</a>
      <br />
      {/*<span className="small">E-Mail:</span>*/}
      <a className="underlined-link" href="mailto:contact@invisiblehand.agency">
        contact@invisiblehand.agency
      </a>{" "}
      <br />
    </p>

    {/*<h5>Umsatzsteuer-Identifikationsnummer*/}
    {/*  <br />gemäß §27a Umsatzsteuergesetz:</h5>*/}
    {/*<p>*/}
    {/*          DE <br />*/}
    {/*          St.-Nr. <br />*/}
    {/*</p>*/}
    <h5>Website</h5>
    <p>
      <a className="underlined-link" href="mailto:info@200kilo.com">
        200kilo
      </a>
    </p>
    <h5>Schrift</h5>
    <p>
      Favorit von{" "}
      <a className="underlined-link" href="https://abcdinamo.com">
        Dinamo
      </a>
    </p>
    <h5>Haftungsausschluss:</h5>
    <p>
      Haftung für InhalteDie Inhalte unserer Seiten wurden mit größter Sorgfalt
      erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
      können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir
      gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
      allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
      Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte
      fremde Informationen zu überwachen oder nach Umständen zu forschen, die
      auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung
      oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen
      bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab
      dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
      Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
      Inhalte umgehend entfernen.
    </p>

    <h5>Haftung für Links</h5>
    <p>
      Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren
      Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden
      Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten
      Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
      verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung
      auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
      Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche
      Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte
      einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
      Rechtsverletzungen werden wir derartige Links umgehend entfernen.
    </p>
    <h5>Urheberrecht</h5>
    <p>
      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
      Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
      Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen
      des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen
      Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den
      privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf
      dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte
      Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
      gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung
      aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei
      Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend
      entfernen.
    </p>
  </article>
);

export default Text;