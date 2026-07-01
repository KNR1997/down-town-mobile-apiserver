import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  // @Get(':id/pdf')
  // async downloadPdf(@Param('id') id: number, @Res() res: Response) {
  //   const pdf = await this.invoicesService.generatePdf(+id);

  //   res.set({
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': `attachment; filename=invoice-${id}.pdf`,
  //     'Content-Length': pdf.length,
  //   });

  //   res.end(pdf);
  // }
}
