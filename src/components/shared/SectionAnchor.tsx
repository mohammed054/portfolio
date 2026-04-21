interface SectionAnchorProps {
  id: string;
}

function SectionAnchor({ id }: SectionAnchorProps) {
  return <div id={id} style={{ position: 'relative', top: '-100px' }} />;
}

export default SectionAnchor;