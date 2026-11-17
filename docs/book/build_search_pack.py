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
flow=head('Search an area','Example 02 - Chapter Two. Choose two areas, compare twenty listings and build a three-property shortlist.')
flow += [P('Start with your buying brief','h'),P('Use this pack with your Chapter One buying brief. Asking prices and advertised rents are starting points for research. Keep evidence and assumptions separate.')]
for label in ['My goal and chosen strategy','Deal cash available / household reserve / separate contingency','Time and travel I can commit / team I need','My budget limit and rejection rules']:
 flow += [box(label,23),Spacer(1,4*mm)]
flow += [P('How to use the pack','h'),P('1. Research two areas. 2. Record ten broadly comparable listings in each. 3. Speak to two local agents and visit relevant streets. 4. Shortlist three properties and record the next evidence needed.'),P('Use the free Property Predator Chrome extension from propertypredator.com to analyse listings alongside your local research. Check report inputs and comparables before relying on an estimate.','small'),PageBreak()]
for area in ['A','B']:
 flow += head('Area '+area+': learn the market','Area / neighbourhood: __________________________________________________')
 for label,h in [('Why this area fits my goal / travel time and costs',22),('Who lives, works or visits here? Employers, transport and useful services',27),('Street differences: where prices or demand change, and why',27),('Agent 1: name / date / what they said / evidence to check',24),('Agent 2: name / date / what they said / evidence to check',24),('Visit notes: date / time / parking / traffic / surrounding properties',24)]:flow += [box(label,h),Spacer(1,3*mm)]
 flow += [PageBreak()]
 for start in [1,6]:
  flow += head('Area '+area+': listings '+str(start)+'-'+str(start+4),'Area: ___________________________  Strategy / property type: ___________________________<br/>Use similar property types and record the date. A cheap asking price alone does not establish value.')
  rows=[[P('Property / date / source','small'),P('Asking price / rent claim','small'),P('Why it might fit / concerns','small'),P('Evidence needed / next action','small')]]
  for n in range(start,start+5):rows.append([P(str(n)+'. Address / link reference:','small'),'','',''])
  t=Table(rows,colWidths=[51*mm,33*mm,43*mm,47*mm],rowHeights=[14*mm]+[30*mm]*5)
  t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),pale),('GRID',(0,0),(-1,-1),.5,colors.HexColor('#b9c4b8')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),7)]));flow += [t,Spacer(1,5*mm),P('Check comparables: exact street, property type, size, condition, tenure and transaction date. Label asking prices and advertised rents clearly; do not record them as achieved figures.','small'),PageBreak()]
flow += head('My three-property shortlist','Bring the most promising candidates together. You are choosing what to investigate, not committing to buy.')
for n in range(1,4):
 flow += [box(str(n)+'. Address / area / asking price',8),box('Why it fits / biggest unanswered question',15),box('Next action / person to ask / deadline / reject, investigate or ready to view',12),Spacer(1,5*mm)]
flow += [P('Before the next chapter','h'),P('Who would rent or buy each property? What evidence do I have that they want it and can pay the figure my plan needs?'),P('Companion: martinhowardproperty.co.uk/book/companion/','small')]
def footer(c,d):
 w,h=A4;c.setStrokeColor(gold);c.setLineWidth(2);c.line(18*mm,h-13*mm,w-18*mm,h-13*mm);c.setFont('Helvetica',8);c.setFillColor(ink);c.drawString(18*mm,12*mm,'MARTIN HOWARD PROPERTY | Research worksheet, not a valuation or buying approval');c.drawRightString(w-18*mm,12*mm,str(d.page))
p=Path('assets/downloads/before-you-buy-area-search-pack.pdf')
SimpleDocTemplate(str(p),pagesize=A4,rightMargin=18*mm,leftMargin=18*mm,topMargin=21*mm,bottomMargin=21*mm,pageCompression=0,title='Before You Buy - Two-Area Search Pack',author='Martin Howard').build(flow,onFirstPage=footer,onLaterPages=footer)
b=p.read_bytes().replace(b'%\x93\x8c\x8b\x9e',b'%    ');b.decode('ascii');p.write_bytes(b)
print(p,len(b))
