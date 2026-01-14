export default `
<section class="panel finance-panel">

  <section class="section">
    <div class="section-inner charts-row charts-row-3">
      <div id="msci-chart" class="chart-box"></div>
      <div id="bitcoin-chart" class="chart-box"></div>
      <div id="comparison-line-chart" class="chart-box"></div>
    </div>
  </section>

  <section class="section">
    <div class="section-inner charts-row">

      <div class="investment-box">
        <div class="investment-header" data-i18n="investment-title">
          Investitionsvergleich (Jahresende)
        </div>

        <div class="investment-input">
          <label data-i18n="investment-label">Investitionsbetrag (€)</label>
          <input id="investment-amount" type="number" />
        </div>

        <button id="investment-calc-btn" data-i18n="investment-button">Auswerten</button>

        <div id="investment-result" class="investment-result hidden"></div>
      </div>

      <div id="comparison-donut-chart" class="chart-box"></div>

    </div>
  </section>

</section>
`;
