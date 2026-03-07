import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { nomor } = req.query;
  if (!nomor) {
    return res.status(400).json({ message: 'Masukkan nomor di parameter URL, contoh: /api/banding?nomor=628123456789' });
  }

  // format pesan
  const pesan = `
✅ Laporan Berhasil Dikirim!
──────────────────────
📞 Nomor : ${nomor}
📬 Tujuan: WhatsApp Support
──────────────────────
`;

  try {
    // koneksi ke Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // email kamu
        pass: process.env.EMAIL_PASS  // app password Gmail
      }
    });

    // kirim email ke WhatsApp Support
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'support@support.whatsapp.com',
      subject: `Banding Akun WhatsApp (${nomor})`,
      text: pesan
    });

    return res.status(200).json({
      status: 'ok',
      message: pesan
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal kirim email',
      error: error.message
    });
  }
      }
