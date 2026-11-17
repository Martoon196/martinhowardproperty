from pathlib import Path
import re, html, os, io, base64
from PIL import Image
from reportlab.lib.utils import ImageReader

os.chdir(Path(__file__).resolve().parents[2])
svg=Path('assets/img/before-you-buy-author-book.svg').read_text()
encoded=re.search(r'data:image/webp;base64,([^"]+)',svg).group(1)
cover_bytes=io.BytesIO()
Image.open(io.BytesIO(base64.b64decode(encoded))).convert('RGB').save(cover_bytes,'JPEG',quality=78,optimize=True)
cover_bytes.seek(0)
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, PageBreak
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A5
from reportlab.lib.units import mm
ink=colors.HexColor('#142019');gold=colors.HexColor('#E8A33D')
styles={'body':ParagraphStyle('Body',fontName='Helvetica',fontSize=12.5,leading=18,spaceAfter=10,textColor=ink,allowWidows=0,allowOrphans=0), 'h2':ParagraphStyle('Heading',fontName='Helvetica-Bold',fontSize=19,leading=23,spaceBefore=15,spaceAfter=12,keepWithNext=True,textColor=ink,allowWidows=0,allowOrphans=0), 'title':ParagraphStyle('Title',fontName='Helvetica-Bold',fontSize=32,leading=34,spaceAfter=14,textColor=ink,allowWidows=0,allowOrphans=0), 'small':ParagraphStyle('Small',fontName='Helvetica',fontSize=9,leading=13,spaceAfter=9,textColor=ink,allowWidows=0,allowOrphans=0), 'cell':ParagraphStyle('Cell',fontName='Helvetica',fontSize=10.5,leading=14,textColor=ink,allowWidows=0,allowOrphans=0), 'bullet':ParagraphStyle('Bullet',fontName='Helvetica',fontSize=12.5,leading=18,leftIndent=10,firstLineIndent=-10,spaceAfter=10,textColor=ink)}
def fmt(t):
 t=t.replace('—',' - ').replace('–','-').replace('’',"'").replace('“','"').replace('”','"')
 t=html.escape(t);t=t.replace('martinhowardproperty.co.uk/book/companion/', '<link href="https://martinhowardproperty.co.uk/book/companion/" color="#1f6b45">martinhowardproperty.co.uk/book/companion/</link>');return re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',t)
text=Path('docs/book/chapter-01.md').read_text();text=text.replace('The companion walkthrough will show how to turn your answers into practical search criteria. The planned home for the numbered examples is **martinhowardproperty.co.uk/book**.','Use the printable worksheet at **martinhowardproperty.co.uk/book/companion/** to turn your answers into practical search criteria.')
Path('docs/book/chapter-01.md').write_text(text)
flow=[Spacer(1,400),PageBreak()]
chapters=[
('01','Does This Fit Me?','Choose a strategy that fits your goal, cash, time and appetite for problems. Leave with a one-page buying brief.'),
('02','Where Should I Look?','Narrow the map, research the street and find opportunities worth investigating. Build a focused shortlist.'),
('03','Who Will Want This Property?','Identify the tenant or buyer you are serving. Find evidence for demand before relying on a rent or sale price.'),
('04','What Am I Actually Buying?','Use my four first checks: straight and true, knotweed, title and flooding. Turn warning signs into questions and evidence.'),
('05','Do the Numbers Work?','Build the whole appraisal: purchase, works, holding costs and realistic income. Find out what the headline return leaves out.'),
('06','What Could Stop This Working?','Identify the permissions, restrictions and funding conditions that could block your plan. Decide what must be checked before committing.'),
('07','Can I Deliver It?','Match the work to your team, budget and programme. Know who is responsible when the project gets difficult.'),
('08','How Do I Get Out?','Test your sale, rental or refinance exit. Work out what happens if the price is lower or the wait is longer.'),
('09','Should I Buy It - and at What Price?','Bring the evidence together, set your offer ceiling and decide whether to investigate, negotiate or walk away.')]
for offset in (0,3,6):
 flow.extend([Paragraph('YOUR ROAD MAP',styles['small']),Paragraph('Inside the book' if offset==0 else 'Inside the book, continued',styles['title'])])
 if offset==0: flow.append(Paragraph('Nine practical decisions between an interesting listing and an offer you can explain. This preview includes Chapter One.',styles['body']))
 for number,title,promise in chapters[offset:offset+3]:
  flow.extend([Paragraph(number+'  '+fmt(title),styles['h2']),Paragraph(fmt(promise),styles['body'])])
 flow.append(PageBreak())
flow.extend([Paragraph('BEFORE YOU BUY',styles['small']),Paragraph('Does This<br/>Fit Me?',styles['title']),Paragraph('CHAPTER ONE  |  MARTIN HOWARD',styles['small']),Spacer(1,4*mm)])
lines=text.splitlines();i=2
while i<len(lines):
 l=lines[i].strip()
 if not l:i+=1;continue
 if l.startswith('### '):flow.append(Paragraph(fmt(l[4:]),styles['h2']));i+=1;continue
 if l.startswith('|'):
  rows=[]
  while i<len(lines)and lines[i].strip().startswith('|'):
   row=[c.strip()for c in lines[i].strip().strip('|').split('|')]
   if not all(re.fullmatch(r'[-: ]+',c) for c in row):rows.append([Paragraph(fmt(c),styles['cell'])for c in row])
   i+=1
  t=Table(rows,colWidths=[66*mm,46*mm]if len(rows[0])==2 and len(rows)>5 else [35*mm,77*mm],hAlign='LEFT',repeatRows=1)
  t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#E8EDE4')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),('LINEBELOW',(0,0),(-1,-1),.4,colors.HexColor('#D7DCD3'))]));flow.extend([KeepTogether([t,Spacer(1,12)])]);continue
 if l.startswith('- '):flow.append(Paragraph('- '+fmt(l[2:]),styles['bullet']));i+=1;continue
 flow.append(Paragraph(fmt(l),styles['body']));i+=1
flow.extend([Spacer(1,6*mm),Paragraph('Copyright 2026 Martin Howard. Property education, not legal, tax, survey or financial advice. Illustrative figures are examples, not forecasts or promises.',styles['small'])])
def page(c,doc):
 w,h=A5;c.setStrokeColor(gold);c.setLineWidth(2);c.line(18*mm,h-13*mm,w-18*mm,h-13*mm);c.setFont('Helvetica',8);c.setFillColor(ink);c.drawString(18*mm,11*mm,'BEFORE YOU BUY  |  MARTIN HOWARD');c.drawRightString(w-18*mm,11*mm,str(doc.page-1))
def cover(c,doc):
 w,h=A5;c.setFillColor(colors.HexColor('#f5f3ed'));c.rect(0,0,w,h,fill=1,stroke=0)
 c.drawImage(ImageReader(cover_bytes),0,(h-w*1402/1122)/2,width=w,height=w*1402/1122)

p=Path('assets/downloads/before-you-buy-chapter-one.pdf')
doc=SimpleDocTemplate(str(p),pagesize=A5,rightMargin=18*mm,leftMargin=18*mm,topMargin=21*mm,bottomMargin=21*mm,pageCompression=0,title='Before You Buy - Chapter One: Does This Fit Me?',author='Martin Howard')
doc.build(flow,onFirstPage=cover,onLaterPages=page)
b=p.read_bytes();b=b.replace(b'%\x93\x8c\x8b\x9e',b'%    ');b.decode('ascii');p.write_bytes(b)
print('PDF bytes:',len(b))
