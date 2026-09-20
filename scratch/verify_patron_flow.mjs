import { spawn } from 'node:child_process';

async function run() {
  const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9224',
    'about:blank',
  ]);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9224/json/list');
    const tabs = await listRes.json();
    const wsUrl = tabs[0].webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);

    await new Promise((resolve) => {
      ws.onopen = resolve;
    });

    let msgId = 1;
    const pendingPromises = new Map();

    function send(method, params = {}) {
      const id = msgId++;
      return new Promise((resolve, reject) => {
        pendingPromises.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    const errors = [];
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && pendingPromises.has(data.id)) {
        const { resolve } = pendingPromises.get(data.id);
        pendingPromises.delete(data.id);
        resolve(data.result);
      }
      if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') {
        errors.push({ type: 'console.error', args: data.params.args });
      }
      if (data.method === 'Runtime.exceptionThrown') {
        errors.push({ type: 'exception', details: data.params.exceptionDetails });
      }
    };

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Page.navigate', { url: 'http://localhost:5174/orders' });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 1. Verify Patron Authentication Screen is rendered when unauthenticated
    const unauthEval = await send('Runtime.evaluate', {
      expression: `({
        heading: document.querySelector('h1')?.innerText,
        hasPatronAuthBadge: document.body.innerText.includes('Patron Security Authentication'),
        hasPhoneInput: !!document.querySelector('input[type="tel"]'),
        bodyTextSnippet: document.body.innerText.substring(0, 300)
      })`,
      returnByValue: true,
    });
    console.log('Unauthenticated Patron View:', unauthEval.result.value);

    // 2. Simulate Patron Login (Set patron session in localStorage and reload to test patron dossier)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const session = {
          phone: '8796841184',
          name: 'Mayank Saxena',
          loggedInAt: new Date().toISOString()
        };
        localStorage.setItem('aviora_patron_session', JSON.stringify(session));
        // Add sample order for Mayank Saxena to localStorage if not already present
        const existing = JSON.parse(localStorage.getItem('aura_orders_history') || '[]');
        if (!existing.some(o => o.orderNumber === 'AVR-IN-155651')) {
          existing.unshift({
            id: 'ord_155651',
            orderNumber: 'AVR-IN-155651',
            createdAt: new Date().toISOString(),
            orderDate: '20 Sep 2026',
            customerName: 'Mayank Saxena',
            customerEmail: 'mayank.saxena@atelier.in',
            customerPhone: '8796841184',
            shippingAddress: 'Sector 42, Golf Course Road',
            city: 'Gurugram',
            state: 'Haryana',
            postalCode: '122002',
            country: 'India',
            paymentMethod: 'PhonePe',
            subtotal: 12500,
            discount: 0,
            total: 12500,
            currency: 'INR',
            status: 'PREPARING',
            courier: 'Blue Dart Express Air',
            trackingNumber: '',
            bluedartConsignmentNo: '',
            whatsappNotifications: [
              {
                id: 'wa_conf',
                templateName: 'aviora_order_confirmed',
                stage: 'CONFIRMED',
                sentAt: '2026-09-20T02:46:00.000Z',
                recipientPhone: '8796841184',
                previewText: '✦ AVIORA — ORDER UPDATE ✦\\n\\nNamaste Mayank Saxena,\\n\\nYour AVIORA jewellery order #AVR-IN-155651 has been updated to:\\n*PAYMENT CONFIRMED & MATERIAL QUEUED*\\n\\n📌 Status Details: Your payment is confirmed! Your made-to-order piece has entered the atelier queue.'
              },
              {
                id: 'wa_prep',
                templateName: 'aviora_order_preparing',
                stage: 'PREPARING',
                sentAt: '2026-09-20T02:48:00.000Z',
                recipientPhone: '8796841184',
                previewText: '✦ AVIORA — ORDER UPDATE ✦\\n\\nNamaste Mayank Saxena,\\n\\nYour AVIORA jewellery order #AVR-IN-155651 has been updated to:\\n*HANDCRAFTING & STUDIO PREPARATION*\\n\\n📌 Status Details: Our Jaipur & Mumbai master jewelers are currently handcrafting and casting your piece in Fine 925 Sterling Silver (15–20 business days).'
              }
            ]
          });
          localStorage.setItem('aura_orders_history', JSON.stringify(existing));
        }
      })()`,
    });

    // Reload page to reflect authenticated state
    await send('Page.navigate', { url: 'http://localhost:5174/orders' });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 3. Inspect Authenticated Patron Dossier
    const authDossierEval = await send('Runtime.evaluate', {
      expression: `({
        heading: document.querySelector('h1')?.innerText,
        hasPatronPill: document.body.innerText.includes('Mayank Saxena'),
        hasPhone: document.body.innerText.includes('8796841184'),
        bodyText: document.body.innerText
      })`,
      returnByValue: true,
    });
    console.log('Heading:', authDossierEval.result.value.heading);
    console.log('Has Mayank Saxena:', authDossierEval.result.value.hasPatronPill);

    // Click "LOAD SAMPLE COMMISSION" button
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('LOAD SAMPLE COMMISSION') || b.innerText.includes('Load Sample Commission'));
        if (btn) btn.click();
      })()`,
    });

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Inspect active order and 5-stage timeline with WhatsApp cards
    const orderInspected = await send('Runtime.evaluate', {
      expression: `(() => {
        const body = document.body.innerText;
        const stepperIdx = body.indexOf('REAL-TIME TRANSIT PROGRESS');
        return {
          stepperSection: body.substring(stepperIdx, stepperIdx + 2000),
          includesOfficial: body.includes('Official WhatsApp Dispatch'),
          includesWhatsApp: body.includes('WhatsApp'),
        };
      })()`,
      returnByValue: true,
    });
    console.log('\n=== Stepper Section Text ===\n', orderInspected.result.value);

    // 4. Verify 0 Runtime Console Errors
    if (errors.length > 0) {
      console.error('Console errors:', JSON.stringify(errors, null, 2));
    } else {
      console.log('✓ ZERO runtime errors or exceptions in browser session!');
    }

    ws.close();
  } finally {
    chromeProc.kill('SIGKILL');
  }
}

run().catch(console.error);
