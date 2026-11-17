from pathlib import Path
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
import os
os.chdir(Path(__file__).resolve().parents[2])
ink=colors.HexColor('#142019');gold=colors.HexColor('#e8a33d');pale=colors.HexColor('#edf1e9')
styles={k:ParagraphStyle(k,fontName=f,fontSize=z,leading=l,textColor=ink,spaceAfter=8) for k,f,z,l in [('title','Helvetica-Bold',27,31),('h','Helvetica-Bold',15,20),('body','Helvetica',11,16),('small','Helvetica',9,13)]}
def P(s,k='body'):return Paragraph(s,styles[k])
def head(title,desc):return [P('BEFORE YOU BUY  |  FREE BOOK COMPANION','small'),P(title,'title'),P(desc),Spacer(1,5*mm)]
def box(label,height=24):
 t=Table([[P(label,'small')],['']],colWidths=[174*mm],rowHeights=[9*mm,height*.72*mm]);t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),pale),('BOX',(0,0),(-1,-1),.5,colors.HexColor('#b9c4b8')),('VALIGN',(0,0),(-1,-1),'TOP')]));return t
flow=head('Four first checks','Chapter Four - viewing worksheet. Property: ___________________________________<br/>Date: __________________  Intended use: __________________________________')
for title,desc in [
('1. Straight and true','Floors, ceilings, ledges, frames, walls and roof lines. Note dips, bows and cracks; record the location and any history. A visual check does not prove structural safety.'),
('2. Japanese knotweed','Suspected growth, specialist identification, existing reports, management plan, costs and lender requirements. Tell the specialist about planned excavation or building work.')]:
 flow += [P(title,'h'),P(desc),box('What I noticed / photograph references / documents already available',34),Spacer(1,4*mm),box('Evidence needed / competent person or team member / deadline',26),Spacer(1,6*mm)]
flow += [P('Roof and damp prompts','h'),P('Roof covering and visible distortion; eaves, gutters and downpipes; water entry; heating and ventilation history. Establish the cause before choosing the repair.','small'),PageBreak()]
flow += head('Turn concerns into decisions','Property: __________________________________________________________________')
for title,desc in [
('3. Title and tenure','Boundary and access questions; shared routes; flying or creeping freehold; remaining lease, charges and restrictions. Match the legal checks and finance product to your intended use.'),
('4. Flood position','Search results, actual building levels, known history and relevant water sources. Record further assessment, lender response and insurance terms; elevation alone is not a complete assessment.')]:
 flow += [P(title,'h'),P(desc),box('What I noticed / evidence received / questions still open',22),Spacer(1,3*mm),box('Next action / who will answer / deadline',16),Spacer(1,4*mm)]
flow += [P('My decision before committing','h'),box('Known work and costs / separate contingency / unresolved costs',14),Spacer(1,3*mm),box('Investigate, negotiate or walk away? What must happen before I proceed?',10),P('These are first checks. Consider other building, service, access and use issues. No worksheet replaces the inspections or legal advice appropriate to the property.','small')]
def footer(c,d):
 w,h=A4;c.setStrokeColor(gold);c.setLineWidth(2);c.line(18*mm,h-13*mm,w-18*mm,h-13*mm);c.setFont('Helvetica',8);c.setFillColor(ink);c.drawString(18*mm,12*mm,'MARTIN HOWARD PROPERTY | Research worksheet, not a valuation or buying approval');c.drawRightString(w-18*mm,12*mm,str(d.page))
p=Path('assets/downloads/before-you-buy-four-first-checks.pdf')
SimpleDocTemplate(str(p),pagesize=A4,rightMargin=18*mm,leftMargin=18*mm,topMargin=21*mm,bottomMargin=21*mm,pageCompression=0,title='Before You Buy - Four First Checks',author='Martin Howard').build(flow,onFirstPage=footer,onLaterPages=footer)
b=p.read_bytes().replace(b'%\x93\x8c\x8b\x9e',b'%    ');b.decode('ascii');p.write_bytes(b)
print(p,len(b))
