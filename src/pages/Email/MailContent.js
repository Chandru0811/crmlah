import React from 'react';

const mailContent = () => {
  let mailContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Invoice</title>
    <style>
        body {
            background-color: #ddd;
        }

        .invoice-box {
            font-size: 12px;
            max-width: 600px;
            background-color: #fff;
            margin: auto;
            padding: 30px;
            border-bottom: 3px solid #0059ff;
            line-height: 24px;
            font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
            color: #555;
            min-height: 85vh;
        }

        .invoice-box table {
            width: 100%;
            line-height: inherit;
            text-align: left;
        }

        .invoice-box table td {
            padding: 5px;
            vertical-align: top;
        }

        .invoice-box table td.third {
            text-align: right;
        }

        .invoice-box table tr.heading td {
            background: #eee;
            border-bottom: 1px solid #ddd;
            font-weight: bold;
        }

        .invoice-box table tr.item td {
            border-bottom: 1px solid #eee;
        }

        .invoice-box table tr.item.last td {
            border-bottom: none;
        }

        .invoice-box table tr.total td:nth-child(2) {
            border-top: 2px solid #eee;
            font-weight: bold;
        }

        .invoice {
            padding: 1rem;
        }

        #scan {
            float: right;
        }

        #scan img {
            max-width: 100%;
            height: auto;
        }

        @media print {
            .invoice-box {
                border: 0;
            }
        }

        .preserve-whitespace {
            white-space: pre-wrap;
        }
    </style>
</head>

<body>
    <div class="invoice-box">
        <div class="invoice">
            <h1 style="color: black;">Dear Chandru,</h1>
            <div id="email-content" class="preserve-whitespace" style="margin: 2rem 0 0; font-size: 0.9rem;"></div>
            <hr />
            <p style="margin: 2rem 0 0;">Best regards,</p>
            <h4 style="margin: 0;">Rajangam Nedumaran,</h4>
            <p style="margin: 0;">Developer</p>
            <p style="margin: 0;">ECS Cloud</p>
            <p style="margin: 0 ;">+91 6385921258</p>
            <p style="margin: 0 0 2rem 0;">support@gmail.com</p>
            <hr />
        </div>
    </div>

    <script>
        const emailContent = \`My name is Rajangam Nedumaran, and I am the Developer at CloudECS.
I am writing to introduce our company and propose a potential
collaboration that I believe could be mutually beneficial for both our organizations.

At CloudECS, we specialize in [briefly describe your company's services/products]. We have been following your impressive work in
the industry and are particularly interested in exploring ways in
which we could combine our expertise to achieve greater success together.

I would love to schedule a meeting at your earliest convenience to discuss this
proposal in more detail and explore how our collaboration can help achieve our respective goals.
Please let me know your availability, and I will be happy to coordinate accordingly.

Thank you for considering this opportunity. I look forward to the possibility of working together.\`;

        document.getElementById('email-content').textContent = emailContent;
    </script>
</body>
</html>`;

  return mailContent;
}

export default mailContent;
