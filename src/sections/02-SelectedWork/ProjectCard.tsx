interface ProjectCardProps {
  name: string;
  category: string;
  url: string;
}

function ProjectCard({ name, category, url }: ProjectCardProps) {
  return (
    <a href={url} className="project-card">
      <div className="image">{name}</div>
      <div className="info">
        <h3>{name}</h3>
        <p>{category}</p>
      </div>
    </a>
  );
}

export default ProjectCard;