import { Code2, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export function FeaturedWork() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // TODO: add projects
  const projects = [
    {
      title: 'E-Commerce sPlatform',
      description:
        'A full-featured online store with real-time inventory management',
      tech: ['React', 'TypeScript', 'Tailwind'],
      link: '#',
    },
    {
      title: 'Task Management App',
      description: 'Collaborative workspace with drag-and-drop functionality',
      tech: ['Next.js', 'Supabase', 'React DnD'],
      link: '#',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Real-time data visualization with interactive charts',
      tech: ['React', 'D3.js', 'Node.js'],
      link: '#',
    },
  ];
  return (
    <section className='mb-20'>
      <h2 className='text-3xl font-bold text-slate-900 mb-10 flex items-center gap-3'>
        Featured Work
        <div className='h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent'></div>
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {projects.map((project, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredProject(index)}
            onMouseLeave={() => setHoveredProject(null)}
            className='group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden'
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-700 transition-opacity duration-500 ${
                hoveredProject === index ? 'opacity-5' : 'opacity-0'
              }`}
            ></div>

            <div className='relative z-10'>
              <div className='flex items-start justify-between mb-4'>
                <div className='w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 transition-colors duration-300'>
                  <Code2
                    size={24}
                    className='text-slate-700 group-hover:text-white transition-colors duration-300'
                  />
                </div>
                <a
                  href={project.link}
                  className='opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                  aria-label='View project'
                >
                  <ExternalLink
                    size={20}
                    className='text-slate-400 hover:text-slate-900 transition-colors'
                  />
                </a>
              </div>

              <h3 className='text-xl font-bold text-slate-900 mb-2'>
                {project.title}
              </h3>
              <p className='text-slate-600 mb-4 leading-relaxed'>
                {project.description}
              </p>

              <div className='flex flex-wrap gap-2'>
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className='px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-full'
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
