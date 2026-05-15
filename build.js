const fs = require('fs');
const path = require('path');

let template = fs.readFileSync('template.html', 'utf8');
const dataDir = './data';
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const jsonPath = path.join(dataDir, file);
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const slug = data.PAGE_SLUG;
  console.log(`🔨 Gerando: ${slug}.html`);

  let html = template;

  const simple = ['TITLE','META_DESCRIPTION','KEYWORDS','OG_TITLE','OG_DESCRIPTION','OG_URL','OG_IMAGE',
    'TWITTER_TITLE','TWITTER_DESCRIPTION','TWITTER_IMAGE','LCP_IMAGE','ALERT_TEXT','DATE_PUBLISHED',
    'DATE_MODIFIED','DATE','READ_TIME','ARTICLE_H1','HERO_LEAD','SCORE','SCORE_STARS','STARS',
    'CURRENT_PAGE','PRODUCT_NAME','PRODUCT_SKU','PRODUCT_GTIN','PRODUCT_IMAGE','PRODUCT_DESCRIPTION',
    'BRAND_NAME','PRODUCT_PRICE','PRICE_VALID_UNTIL','AFFILIATE_URL','SELLER_NAME','RATING_VALUE',
    'REVIEW_COUNT','SPECS_INTRO','VERDICT_SCORE','VERDICT_TITLE','VERDICT_TEXT','VERDICT_NOTE',
    'CTA_EYEBROW','CTA_TITLE','OLD_PRICE','NEW_PRICE','SHIPPING','CTA_BUTTON','CTA_NOTE',
    'CTA2_EYEBROW','CTA2_TITLE','CTA2_BUTTON','CTA2_NOTE','DISCOUNT','SHIPPING_BADGE',
    'CTA_BUTTON_SIDEBAR','CTA_OUTLINE_TEXT','SECTION','WORD_COUNT','CANONICAL','FULL_URL'];

  simple.forEach(k => {
    if (data[k] !== undefined) html = html.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), data[k]);
  });

  // SCORE_BARS
  let barsHTML = '';
  data.SCORE_BARS.forEach(bar => {
    barsHTML += `<div class="bar-row" role="listitem"><span class="bar-label">${bar.LABEL}</span><div class="bar-track"><div class="bar-fill" style="width:${bar.WIDTH}%"></div></div><span class="bar-val">${bar.VALUE}</span></div>`;
  });
  html = html.replace(/\{\{#SCORE_BARS\}\}[\s\S]*?\{\{\/SCORE_BARS\}\}/g, barsHTML);

  // META_TAGS
  let metaTagsHTML = '';
  data.META_TAGS.forEach(tag => { metaTagsHTML += `<span class="meta-tag">${tag}</span>`; });
  html = html.replace(/\{\{#META_TAGS\}\}[\s\S]*?\{\{\/META_TAGS\}\}/g, metaTagsHTML);

  // BREADCRUMBS
  let breadcrumbHTML = '';
  data.BREADCRUMBS.forEach((bc, i) => {
    breadcrumbHTML += `<a href="${bc.URL}">${bc.NAME}</a>`;
    if (i < data.BREADCRUMBS.length - 1) breadcrumbHTML += `<span aria-hidden="true">›</span>`;
  });
  html = html.replace(/\{\{#BREADCRUMB_HTML\}\}[\s\S]*?\{\{\/BREADCRUMB_HTML\}\}/g, breadcrumbHTML);

  // SPECS
  let specsHTML = '';
  data.SPECS.forEach(spec => { specsHTML += `<tr><td>${spec.NAME}</td><td>${spec.VALUE}</td></tr>`; });
  html = html.replace(/\{\{#SPECS\}\}[\s\S]*?\{\{\/SPECS\}\}/g, specsHTML);

  // SECTIONS
  let sectionsHTML = '';
  data.SECTIONS.forEach(sec => { sectionsHTML += `<h2 id="${sec.ID}">${sec.TITLE}</h2>${sec.CONTENT}`; });
  html = html.replace(/\{\{#SECTIONS\}\}[\s\S]*?\{\{\/SECTIONS\}\}/g, sectionsHTML);

  // COMPARE_TABLE
  if (data.COMPARE_TABLE) {
    let colsHTML = '';
    data.COMPARE_TABLE.COLUMNS.forEach(col => { colsHTML += `<th scope="col"${col.WINNER ? ' class="col-winner"' : ''}>${col.NAME}</th>`; });
    let rowsHTML = '';
    data.COMPARE_TABLE.ROWS.forEach(row => {
      let cellsHTML = '';
      row.CELLS.forEach(cell => { cellsHTML += `<td${cell.WINNER ? ' class="col-winner"' : ''}>${cell.VALUE}</td>`; });
      rowsHTML += `<tr><td>${row.FEATURE}</td>${cellsHTML}</tr>`;
    });
    const compareBlock = `<h2 id="comparativo">${data.COMPARE_TABLE.TITLE}</h2><p>${data.COMPARE_TABLE.COMPARE_INTRO}</p><table class="compare-table"><caption style="text-align:left; margin-bottom:12px; font-size:.82rem; color:var(--muted); font-weight:600;">${data.COMPARE_TABLE.CAPTION}</caption><thead><tr><th scope="col">Recurso</th>${colsHTML}</tr></thead><tbody>${rowsHTML}</tbody></table><div class="highlight-box"><p>${data.COMPARE_TABLE.COMPARE_RESULT}</p></div>`;
    html = html.replace(/\{\{#COMPARE_TABLE\}\}[\s\S]*?\{\{\/COMPARE_TABLE\}\}/g, compareBlock);
  } else {
    html = html.replace(/\{\{#COMPARE_TABLE\}\}[\s\S]*?\{\{\/COMPARE_TABLE\}\}/g, '');
  }

  // PROS / CONS
  let prosHTML = ''; data.PROS.forEach(p => { prosHTML += `<li>${p}</li>`; });
  let consHTML = ''; data.CONS.forEach(c => { consHTML += `<li>${c}</li>`; });
  html = html.replace(/\{\{#PROS\}\}[\s\S]*?\{\{\/PROS\}\}/g, prosHTML);
  html = html.replace(/\{\{#CONS\}\}[\s\S]*?\{\{\/CONS\}\}/g, consHTML);

  // REVIEWS (HTML block)
  let reviewsHTML = '';
  data.REVIEWS.forEach(rev => {
    reviewsHTML += `<div class="review-card"><div class="stars" aria-label="${rev.STARS}">${rev.STARS_VISUAL}</div><p>${rev.BODY}</p><div class="reviewer">${rev.AUTHOR}</div><div class="reviewer-loc">${rev.LOCATION} — ${rev.MONTH}</div></div>`;
  });
  html = html.replace(/\{\{#REVIEWS\}\}[\s\S]*?\{\{\/REVIEWS\}\}/g, reviewsHTML);

  // FAQS (HTML block)
  let faqsHTML = '';
  data.FAQS.forEach(faq => {
    faqsHTML += `<details itemscope itemprop="mainEntity" itemtype="https://schema.org/Question"><summary itemprop="name">${faq.QUESTION}</summary><div class="faq-answer" itemprop="acceptedAnswer" itemtype="https://schema.org/Answer"><p itemprop="text">${faq.ANSWER}</p></div></details>`;
  });
  html = html.replace(/\{\{#FAQS\}\}[\s\S]*?\{\{\/FAQS\}\}/g, faqsHTML);

  // Schema REVIEWS JSON
  let reviewsSchemaHTML = data.REVIEWS.map((rev, i) =>
    `{"@type":"Review","reviewRating":{"@type":"Rating","ratingValue":"${rev.RATING}","bestRating":"5"},"author":{"@type":"Person","name":"${rev.AUTHOR}"},"datePublished":"${rev.DATE}","reviewBody":"${rev.BODY}"}${i < data.REVIEWS.length - 1 ? ',' : ''}`
  ).join('');
  html = html.replace(/\{\{#SCHEMA_REVIEWS\}\}[\s\S]*?\{\{\/SCHEMA_REVIEWS\}\}/g, reviewsSchemaHTML);

  // Schema FAQS JSON
  let faqsSchemaHTML = data.FAQS.map((faq, i) =>
    `{"@type":"Question","name":"${faq.QUESTION.replace(/"/g, '\\"')}","acceptedAnswer":{"@type":"Answer","text":"${faq.ANSWER.replace(/"/g, '\\"')}"}}${i < data.FAQS.length - 1 ? ',' : ''}`
  ).join('');
  html = html.replace(/\{\{#SCHEMA_FAQS\}\}[\s\S]*?\{\{\/SCHEMA_FAQS\}\}/g, faqsSchemaHTML);

  // Schema BREADCRUMBS JSON
  let bcSchema = data.BREADCRUMBS.map((bc, i) =>
    `{"@type":"ListItem","position":"${i+1}","name":"${bc.NAME}","item":"https://vetor.blog${bc.URL}"}${i < data.BREADCRUMBS.length - 1 ? ',' : ''}`
  ).join('');
  html = html.replace(/\{\{#SCHEMA_BREADCRUMBS\}\}[\s\S]*?\{\{\/SCHEMA_BREADCRUMBS\}\}/g, bcSchema);

  // TOC
  let tocHTML = '';
  data.TOC.forEach(item => { tocHTML += `<li><a href="#${item.ID}">${item.LABEL}</a></li>`; });
  html = html.replace(/\{\{#TOC\}\}[\s\S]*?\{\{\/TOC\}\}/g, tocHTML);

  // RELATED
  let relHTML = '';
  data.RELATED.forEach(rel => {
    relHTML += `<a href="${rel.URL}" style="background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); padding:20px; display:block; transition:.3s;" onmouseover="this.style.borderColor='var(--blue)'" onmouseout="this.style.borderColor='var(--border)'"><div style="font-family:'Syne',sans-serif; font-weight:800; font-size:.72rem; letter-spacing:.12em; text-transform:uppercase; color:var(--blue); margin-bottom:8px;">${rel.TYPE}</div><div style="font-weight:600; font-size:.95rem; margin-bottom:6px;">${rel.TITLE}</div><div style="color:var(--muted); font-size:.84rem;">${rel.DESC}</div></a>`;
  });
  html = html.replace(/\{\{#RELATED\}\}[\s\S]*?\{\{\/RELATED\}\}/g, relHTML);

  // SIDEBAR_RELATED
  let sidebarRelHTML = '';
  data.SIDEBAR_RELATED.forEach(rel => { sidebarRelHTML += `<a href="${rel.URL}" class="related-item">${rel.LABEL}</a>`; });
  html = html.replace(/\{\{#SIDEBAR_RELATED\}\}[\s\S]*?\{\{\/SIDEBAR_RELATED\}\}/g, sidebarRelHTML);

  const outputPath = `./pages/${slug}.html`;
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`✅ ${outputPath} criado (${data.WORD_COUNT} palavras)\n`);
});

console.log('\n🎉 Todas as páginas geradas com sucesso!');
