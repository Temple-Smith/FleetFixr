package com.fleetfix.fleetfix_service;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/powerunits/cvip")
public class CvipController {

    @Autowired
    private PowerUnitService powerUnitService;

    @GetMapping("/getPdf/{vin}")
    public ResponseEntity<byte[]> getCvipPdf(@PathVariable String vin) {
        PowerUnit unit = powerUnitService.findByVin(vin)
                .orElseThrow(() -> new RuntimeException("Vin Not Found"));
        byte[] pdfBytes = unit.getCvipPdf();

        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=\"cvip-" + vin + ".pdf\"")
                .body(pdfBytes);
    }


    @PostMapping("/saveFields")
    public ResponseEntity<String> saveFields(@RequestBody CvipFieldRequest request) throws IOException {
        File file = new File("src/main/resources/templates/cvip.pdf");
        PDDocument doc = Loader.loadPDF(file);
        //return ResponseEntity.ok("Loaded that bitch.");

        PDPage page = doc.getPage(0);
        PDPageContentStream contentStream = new PDPageContentStream(doc, page, PDPageContentStream.AppendMode.APPEND, true);

        //set font size
        PDType1Font font = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
        contentStream.setFont(font,14);

        float startX = 56;
        float startY = 630;
        float spacing = 33;

        // 3. Write the VIN to the PDF
        String vin = request.getVin();
        for (int i=0; i < vin.length(); i++) {
            contentStream.beginText();
            contentStream.newLineAtOffset(startX + i * spacing, startY);
            contentStream.showText(String.valueOf(vin.charAt(i)));
            contentStream.endText();
        }
        contentStream.close();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        doc.save(baos);
        doc.close(); //close the document
        byte[] finalPdfBytes = baos.toByteArray();

        powerUnitService.saveCvipPdf(request.getVin(), finalPdfBytes);

        return ResponseEntity.ok("Loaded that hoe.");





    }

}
