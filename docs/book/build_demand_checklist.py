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
flow=head('Compare the evidence','Example 03 - Chapter Three. Use one copy per shortlisted property. Compare like with like and keep asking figures separate from achieved figures.')
for label,h in [('Property / date / strategy / proposed rent or sale price',18),('Local pattern: similar stock available, letting times, price reductions and empty homes',22)]: flow += [box(label,h),Spacer(1,4*mm)]
flow += [P('Check each comparable','h'),P('Tick when checked. Write down differences that affect the comparison.')]
for label in ['[ ] Exact street and position  [ ] Property type and tenure','[ ] Floor area, bedrooms and usable layout  [ ] Condition and finish','[ ] Furnished or unfurnished  [ ] Bills and services included','[ ] Parking, storage and outside space  [ ] Access and daily journeys','[ ] HMO: room size, bathroom and shared facilities','[ ] SA: unit type, location, season and available-night definition','[ ] Asking or achieved figure  [ ] Source and date','[ ] Time on market and price changes  [ ] Verified or still assumed']:
 flow += [P(label),Spacer(1,2*mm)]
flow += [box('Competition and new supply: what is available or being built, and what might it change?',25),PageBreak()]
flow += head('What supports my figure?','Keep the listing or report reference beside your notes. An estimate is not a guaranteed rent, sale price or occupancy rate.')
for n in range(1,4):
 flow += [box(str(n)+'. Comparable address / link / source / date',10),box('Asking or achieved / amount / time on market / important differences',19),Spacer(1,4*mm)]
flow += [box('Agent evidence: who / when / recent examples / where their estimate differs',20),Spacer(1,4*mm),box('Supported range / working appraisal figure / why I chose it',18),Spacer(1,4*mm),box('Biggest remaining assumption / next action / deadline',18)]
def footer(c,d):
 w,h=A4;c.setStrokeColor(gold);c.setLineWidth(2);c.line(18*mm,h-13*mm,w-18*mm,h-13*mm);c.setFont('Helvetica',8);c.setFillColor(ink);c.drawString(18*mm,12*mm,'MARTIN HOWARD PROPERTY | Research worksheet, not a valuation or buying approval');c.drawRightString(w-18*mm,12*mm,str(d.page))
p=Path('assets/downloads/before-you-buy-demand-checklist.pdf')
SimpleDocTemplate(str(p),pagesize=A4,rightMargin=18*mm,leftMargin=18*mm,topMargin=21*mm,bottomMargin=21*mm,pageCompression=0,title='Before You Buy - Rental and Demand Comparison Checklist',author='Martin Howard').build(flow,onFirstPage=footer,onLaterPages=footer)
b=p.read_bytes().replace(b'%\x93\x8c\x8b\x9e',b'%    ');b.decode('ascii');p.write_bytes(b)
print(p,len(b))
