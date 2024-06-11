// // const emailemailExistence = require("email-existence");

// // emailemailExistence.check("hafizh.abdillahh@gmail.com", (response, error) => {
// //   console.log(error);
// //   console.log(response);
// // });

// // const emailemailExistence = require("email-existence");
// // const validate = require('deep-email-validator').validate;

// // const main = async () => {
// //   const res = await validate({
// //     email: 'hafizh.abdillahh@gmail.com',
// //     validateSMTP: true,
// //   })
// //   console.log(res)
// // }

// // main()

// const verifyEmail = require('@devmehq/email-validator-js').verifyEmail

// const main = async () => {
//   const { validMx, validFormat, validSmtp } = await verifyEmail({
//     emailAddress: "hafizh.abdillahh@gmail.com",
//     smtpPort: 465,
//     verifyMx: true,
//     verifySmtp: true,
//     debug: true
//   });

//   console.log({ validMx, validFormat, validSmtp });
// };

// main()

const net = require("node:net");
const dns = require("node:dns");

let addrs = [];

dns.resolve4("gmail.com", async (err, addresses) => {
  if (err) throw err;

  console.log(`addresses: ${JSON.stringify(addresses)}`);

  addrs = await Promise.all(
    addresses.map((a) => {
      return new Promise((resolve) => {
        return dns.reverse(a, (err, hostnames) => {
          if (err) {
            throw err;
          }
          return resolve(hostnames);
        });
      });
    })
  );

  console.log(addrs.flatMap((v) => v));
});

const socket = net.connect({
  host: "sb-in-f17.1e100.net",
  port: 465,
  onread: {
    buffer: Buffer.alloc(4 * 1024),
    callback: (nread, buf) => {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString("utf8", 0, nread));
    },
  },
});

const domain = "gmail.com";
const local = "hafizh.abdillahh";

const messages = [
  `HELO ${domain}`,
  `MAIL FROM: <${local}@${domain}>`,
  `RCPT TO: <${local}@${domain}>`,
];

socket.on("connect", (data) => {
  console.log("server connected");
  const message = messages.shift();
  console.log("Mailbox: writing message", message);
  socket.write(message + "\r\n");
});

socket.on("data", (data) => {
  console.log("mailbox: got data", data);
});

socket.on("error", (err) => {
  console.log("socket error", err);
});
