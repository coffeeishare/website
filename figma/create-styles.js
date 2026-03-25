// ============================================================
// Design System → Figma Local Styles + Button Components
// Run in Figma: Plugins > Development > Open console
// Paste the full script and press Enter.
// ============================================================

(async () => {

  // ── HELPERS ──────────────────────────────────────────────────
  const hex = (h) => {
    const n = parseInt(h.replace('#',''), 16);
    return { r: ((n>>16)&255)/255, g: ((n>>8)&255)/255, b: (n&255)/255 };
  };

  const solidFill = (h, alpha = 1) => ({ type: 'SOLID', color: hex(h), opacity: alpha });
  const noFill    = [];//

  // ── COLORS ───────────────────────────────────────────────────
  const colorDefs = [
    { name: 'white',             hex: '#ffffff', alpha: 1     },
    { name: 'off-white',         hex: '#fafafa', alpha: 1     },
    { name: 'bg-card',           hex: '#f0f4f8', alpha: 1     },
    { name: 'text-primary',      hex: '#1a1a1a', alpha: 1     },
    { name: 'text-secondary',    hex: '#6b7280', alpha: 1     },
    { name: 'text-light',        hex: '#9ca3af', alpha: 1     },
    { name: 'accent-yellow',     hex: '#ffd264', alpha: 0.45  }, // rgba(255,210,100,0.45)
    { name: 'accent-blue-light', hex: '#dbeafe', alpha: 1     },
    { name: 'border',            hex: '#e5e7eb', alpha: 1     },
  ];

  let colorCount = 0;
  for (const c of colorDefs) {
    const style = figma.createPaintStyle();
    style.name = c.name;
    style.paints = [{ type: 'SOLID', color: hex(c.hex), opacity: c.alpha }];
    colorCount++;
  }
  console.log(`✓ ${colorCount} color styles created`);

  // ── TEXT STYLES ───────────────────────────────────────────────
  const textDefs = [
    // Body
    { name: 'Body/Default',    family: 'DM Sans', style: 'Regular',  size: 16, lh: 25.6, ls: 0     },
    { name: 'Body/Small',      family: 'DM Sans', style: 'Regular',  size: 14, lh: 23.8, ls: 0     },
    { name: 'Body/XSmall',     family: 'DM Sans', style: 'Medium',   size: 12, lh: null,  ls: 0     },
    // Labels
    { name: 'Label/Navigation',family: 'DM Sans', style: 'Regular',  size: 14, lh: null,  ls: 0.14  }, // 0.01em
    { name: 'Label/Tag',       family: 'DM Sans', style: 'Medium',   size: 13, lh: null,  ls: 0     },
    { name: 'Label/Footer',    family: 'DM Sans', style: 'Regular',  size: 12, lh: null,  ls: 0     },
    // Headings
    { name: 'Heading/Hero',    family: 'DM Sans', style: 'Medium',   size: 46, lh: 55.2,  ls: -0.92 }, // -0.02em
    { name: 'Heading/About',   family: 'DM Sans', style: 'Medium',   size: 36, lh: null,  ls: -0.72 }, // -0.02em
    { name: 'Heading/Section', family: 'DM Sans', style: 'SemiBold', size: 32, lh: 38.4,  ls: -0.64 }, // -0.02em
    { name: 'Heading/Card',    family: 'DM Sans', style: 'Medium',   size: 18, lh: null,  ls: -0.18 }, // -0.01em
    // Paragraphs
    { name: 'Para/Subtitle',   family: 'DM Sans', style: 'Regular',  size: 15, lh: 24,    ls: 0     }, // 1.6
    { name: 'Para/ProjectDesc',family: 'DM Sans', style: 'Regular',  size: 14, lh: 23.8,  ls: 0     }, // 1.7
    { name: 'Para/Quote',      family: 'DM Sans', style: 'Italic',   size: 14, lh: 23.8,  ls: 0     }, // italic 1.7
    // Script
    { name: 'Script/Logo',     family: 'Dancing Script', style: 'Bold', size: 28, lh: null, ls: -0.5 },
  ];

  let textCount = 0;
  const textErrors = [];
  for (const t of textDefs) {
    try {
      await figma.loadFontAsync({ family: t.family, style: t.style });
      const s = figma.createTextStyle();
      s.name = t.name;
      s.fontName = { family: t.family, style: t.style };
      s.fontSize = t.size;
      s.lineHeight = t.lh ? { value: t.lh, unit: 'PIXELS' } : { unit: 'AUTO' };
      s.letterSpacing = { value: t.ls, unit: 'PIXELS' };
      textCount++;
    } catch (e) {
      textErrors.push(`  ✗ ${t.name}: ${e.message}`);
    }
  }
  console.log(`✓ ${textCount} text styles created`);
  if (textErrors.length) { console.warn('Font errors:'); textErrors.forEach(e => console.warn(e)); }

  // ── BUTTON COMPONENTS ─────────────────────────────────────────
  // Load fonts needed for button labels
  await figma.loadFontAsync({ family: 'DM Sans', style: 'Regular' });
  await figma.loadFontAsync({ family: 'DM Sans', style: 'Medium' });

  // Helper: create one button component
  function makeBtn({ name, label, paddingV, paddingH, radius, fontSize, fontStyle, textColor, fillColor, strokeColor }) {
    const comp = figma.createComponent();
    comp.name = name;
    comp.layoutMode = 'HORIZONTAL';
    comp.primaryAxisSizingMode = 'AUTO';
    comp.counterAxisSizingMode = 'AUTO';
    comp.paddingTop    = paddingV;
    comp.paddingBottom = paddingV;
    comp.paddingLeft   = paddingH;
    comp.paddingRight  = paddingH;
    comp.itemSpacing   = 7;
    comp.cornerRadius  = radius;

    // Background fill
    comp.fills = fillColor ? [solidFill(fillColor)] : [];

    // Border stroke
    if (strokeColor) {
      comp.strokes = [solidFill(strokeColor)];
      comp.strokeWeight = 1;
      comp.strokeAlign = 'INSIDE';
    }

    // Label text
    const txt = figma.createText();
    txt.fontName = { family: 'DM Sans', style: fontStyle };
    txt.fontSize = fontSize;
    txt.fills = [solidFill(textColor)];
    txt.characters = label;
    comp.appendChild(txt);

    return comp;
  }

  const btnDefs = [
    {
      name: 'Button/Navigation/Default',
      label: 'Nav link',
      paddingV: 0, paddingH: 0, radius: 0,
      fontSize: 14, fontStyle: 'Regular',
      textColor: '#6b7280', fillColor: null, strokeColor: null,
    },
    {
      name: 'Button/Navigation/Active',
      label: 'Nav link',
      paddingV: 0, paddingH: 0, radius: 0,
      fontSize: 14, fontStyle: 'Regular',
      textColor: '#1a1a1a', fillColor: null, strokeColor: null,
    },
    {
      name: 'Button/Tab/Default',
      label: 'Tab label',
      paddingV: 8, paddingH: 18, radius: 20,
      fontSize: 14, fontStyle: 'Regular',
      textColor: '#6b7280', fillColor: null, strokeColor: null,
    },
    {
      name: 'Button/Tab/Active',
      label: 'Tab label',
      paddingV: 8, paddingH: 18, radius: 20,
      fontSize: 14, fontStyle: 'Medium',
      textColor: '#1a1a1a', fillColor: '#e8f0fa', strokeColor: null,
    },
    {
      name: 'Button/Outlined/Default',
      label: 'Button label',
      paddingV: 10, paddingH: 20, radius: 20,
      fontSize: 14, fontStyle: 'Medium',
      textColor: '#6b7280', fillColor: null, strokeColor: '#e5e7eb',
    },
    {
      name: 'Button/Outlined/Hover',
      label: 'Button label',
      paddingV: 10, paddingH: 20, radius: 20,
      fontSize: 14, fontStyle: 'Medium',
      textColor: '#1a1a1a', fillColor: '#f9fafb', strokeColor: '#9ca3af',
    },
    {
      name: 'Button/CTA/Default',
      label: 'CTA label',
      paddingV: 9, paddingH: 18, radius: 20,
      fontSize: 13, fontStyle: 'Medium',
      textColor: '#6b7280', fillColor: null, strokeColor: '#e5e7eb',
    },
    {
      name: 'Button/CTA/Hover',
      label: 'CTA label',
      paddingV: 9, paddingH: 18, radius: 20,
      fontSize: 13, fontStyle: 'Medium',
      textColor: '#1a1a1a', fillColor: '#f9fafb', strokeColor: '#9ca3af',
    },
  ];

  // Place components in a grid on the canvas
  const PAGE_X = 0;
  const PAGE_Y = 2000; // below existing content
  let xCursor = PAGE_X;
  const comps = [];

  for (const def of btnDefs) {
    const c = makeBtn(def);
    c.x = xCursor;
    c.y = PAGE_Y;
    figma.currentPage.appendChild(c);
    xCursor += c.width + 32;
    comps.push(c);
  }

  console.log(`✓ ${comps.length} button components created on canvas`);
  console.log('\nAll done! Check Local Styles panel + Components panel.');

})();
