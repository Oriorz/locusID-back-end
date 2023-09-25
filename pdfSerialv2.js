const { PDFDocument, StandardFonts, rgb, PageSizes, degrees  } = require('pdf-lib')
const { writeFileSync } = require("fs");

async function createSerial({ name, email, pw, sn, folderpath }) {
  const pdfDoc = await PDFDocument.create()
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const captionReducedSize = 8
  const docVerticalOffset = -5
  const page = pdfDoc.addPage([PageSizes.A9[1], PageSizes.A9[0]])
  const { width, height } = page.getSize()
  const fontSize = 18
  const emailCaption = 'Email :'
  const emailCaptionWidth = timesRomanFont.widthOfTextAtSize(emailCaption, fontSize - captionReducedSize);
  page.drawText(emailCaption, {
    x: page.getWidth() / 2 - emailCaptionWidth / 2,
    y: height - 1.5 * fontSize - docVerticalOffset,
    size: fontSize - captionReducedSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  })
  const emailWidth = timesRomanFont.widthOfTextAtSize(email, fontSize);
  page.drawText(email, {
    x: page.getWidth() / 2 - emailWidth / 2,
    y: height - 2.5 * fontSize - docVerticalOffset,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  })
  const pwCaption = 'PW :'
  const pwCaptionWidth = timesRomanFont.widthOfTextAtSize(pwCaption, fontSize - captionReducedSize);
  page.drawText(pwCaption, {
    x: page.getWidth() / 2 - pwCaptionWidth / 2,
    y: height - 4 * fontSize - docVerticalOffset,
    size: fontSize - captionReducedSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  })
  const pwWidth = timesRomanFont.widthOfTextAtSize(pw, fontSize);
  page.drawText(pw, {
    x: page.getWidth() / 2 - pwWidth / 2,
    y: height - 5 * fontSize - docVerticalOffset,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  })
  const snText = `SN: ${sn}`
  const snTextWidth = timesRomanFont.widthOfTextAtSize(snText, fontSize - captionReducedSize);
  const snTextHeight = timesRomanFont.heightAtSize(fontSize +2 - captionReducedSize);
  page.drawText(snText, {
    x: 12,
    y: page.getHeight() / 2 - snTextHeight / 2 - fontSize -2 + captionReducedSize,
    size: fontSize - captionReducedSize+2,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
    rotate:degrees(90),
    opacity:0.5
  })
  writeFileSync(folderpath + `${name}.pdf`, await pdfDoc.save());
}

module.exports =  createSerial