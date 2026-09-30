import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Dev middleware to route /api/otp/* locally without needing a separate backend server
function fast2SmsDevMiddleware(env) {
  return {
    name: 'fast2sms-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/otp/send' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              req.body = bodyStr ? JSON.parse(bodyStr) : {};
            } catch {
              req.body = {};
            }
            process.env.FAST2SMS_API_KEY = env.FAST2SMS_API_KEY || process.env.FAST2SMS_API_KEY;
            process.env.FAST2SMS_OTP_ID = env.FAST2SMS_OTP_ID || process.env.FAST2SMS_OTP_ID;
            const { default: handler } = await import('./api/otp/send.js');
            const customRes = {
              setHeader: (k, v) => res.setHeader(k, v),
              status: (code) => {
                res.statusCode = code;
                return customRes;
              },
              json: (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              },
              end: () => res.end(),
            };
            await handler(req, customRes);
          });
          return;
        }

        if (req.url === '/api/otp/verify' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              req.body = bodyStr ? JSON.parse(bodyStr) : {};
            } catch {
              req.body = {};
            }
            process.env.FAST2SMS_API_KEY = env.FAST2SMS_API_KEY || process.env.FAST2SMS_API_KEY;
            process.env.FAST2SMS_OTP_ID = env.FAST2SMS_OTP_ID || process.env.FAST2SMS_OTP_ID;
            const { default: handler } = await import('./api/otp/verify.js');
            const customRes = {
              setHeader: (k, v) => res.setHeader(k, v),
              status: (code) => {
                res.statusCode = code;
                return customRes;
              },
              json: (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              },
              end: () => res.end(),
            };
            await handler(req, customRes);
          });
          return;
        }

        if (req.url === '/api/razorpay/create-order' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              req.body = bodyStr ? JSON.parse(bodyStr) : {};
            } catch {
              req.body = {};
            }
            process.env.RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
            process.env.RAZORPAY_KEY_SECRET = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;
            const { default: handler } = await import('./api/razorpay/create-order.js');
            const customRes = {
              setHeader: (k, v) => res.setHeader(k, v),
              status: (code) => {
                res.statusCode = code;
                return customRes;
              },
              json: (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              },
              end: () => res.end(),
            };
            await handler(req, customRes);
          });
          return;
        }

        if (req.url === '/api/razorpay/verify' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            try {
              req.body = bodyStr ? JSON.parse(bodyStr) : {};
            } catch {
              req.body = {};
            }
            process.env.RAZORPAY_KEY_ID = env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
            process.env.RAZORPAY_KEY_SECRET = env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET;
            const { default: handler } = await import('./api/razorpay/verify.js');
            const customRes = {
              setHeader: (k, v) => res.setHeader(k, v),
              status: (code) => {
                res.statusCode = code;
                return customRes;
              },
              json: (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              },
              end: () => res.end(),
            };
            await handler(req, customRes);
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      fast2SmsDevMiddleware(env),
    ],
    server: {
      host: '0.0.0.0',
      port: 5174,
      historyApiFallback: true,
    },
  };
})