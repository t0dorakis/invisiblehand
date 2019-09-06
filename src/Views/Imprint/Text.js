import React from 'react';

const Text = () => (
    <article>
      <h3>Imprint</h3>
      <p>
       <span className="muted">Responsible for content according to § 5 TMG</span>
      </p>
      <p>
            Invisible Hand GbR <br />
            Urbanstr. 115 <br />
            10967 Berlin <br />
            represented by Claudio Banti
      </p>
      <p>

            {/*<span className="small">Tel.:</span>*/}
        <a href="tel:+4915731661319">+49 (0) 157 316 613 19</a><br />
        {/*<span className="small">E-Mail:</span>*/}
        <a className="underlined-link" href="mailto:handshake@invisiblehand.agency">handshake@invisiblehand.agency</a> <br />
      </p>

      {/*<h5>Umsatzsteuer-Identifikationsnummer*/}
      {/*  <br />gemäß §27a Umsatzsteuergesetz:</h5>*/}
      {/*<p>*/}
      {/*          DE <br />*/}
      {/*          St.-Nr. <br />*/}
      {/*</p>*/}
            <h5>
                Website
            </h5>
        <p>
          <a className="underlined-link" href="mailto:info@200kilo.com">200kilo</a>
        </p>
      <h5>
        Font
      </h5>
      <p>
        Favorit by <a className="underlined-link" href="https://abcdinamo.com">Dinamo</a>
      </p>
</article>
);

export default Text;