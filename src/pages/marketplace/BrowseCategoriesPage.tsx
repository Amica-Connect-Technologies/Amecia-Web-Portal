
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ChevronDown, Package } from 'lucide-react';

const ALL_CATEGORIES = [
  { 
    id: '1',
    name: 'Cardiology', 
    desc: 'Heart and blood vessel health specialists.',
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=600&h=300',
    tags: ['Heart', 'Surgery', 'Hospital']
  },
  { 
    id: '2',
    name: 'Dermatology', 
    desc: 'Skin, hair, and nail health experts.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173bdd99625?auto=format&fit=crop&q=80&w=600&h=300',
    tags: ['Skin', 'Cosmetic', 'Clinic']
  },
  { 
    id: '3',
    name: 'Orthopedics', 
    desc: 'Musculoskeletal system care and surgery.',
    image: 'https://images.unsplash.com/photo-1583454155184-870a1f63aebc?auto=format&fit=crop&q=80&w=600&h=300',
    tags: ['Bones', 'Surgery', 'Physical Therapy']
  },
  { 
    id: '4',
    name: 'Neurology', 
    desc: 'Brain and nervous system disorders.',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600&h=300',
    tags: ['Brain', 'Nerves', 'Specialist']
  },
  { 
    id: '5',
    name: 'Oncology', 
    desc: 'Cancer diagnosis and treatment.',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600&h=300',
    tags: ['Cancer', 'Chemo', 'Hospital']
  },
  { 
    id: '6',
    name: 'Psychiatry', 
    desc: 'Mental health and emotional wellness.',
    image: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee1?auto=format&fit=crop&q=80&w=600&h=300',
    tags: ['Mental Health', 'Therapy', 'Clinical']
  },
  { 
    id: '7',
    name: 'Pediatrics', 
    desc: 'Comprehensive medical care for infants and children.',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=600&h=300',
    tags: ['Children', 'Clinic', 'General']
  },
  { 
    id: '8',
    name: 'Radiology', 
    desc: 'Imaging and diagnostic radiation oncology.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600&h=300',
    tags: ['Imaging', 'Diagnostics', 'X-Ray']
  },
  { 
    id: '9',
    name: 'Dentistry', 
    desc: 'Oral health, hygiene, and dental surgery.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600&h=300',
    tags: ['Dental', 'Clinic', 'Surgery']
  },
  { 
    id: '10',
    name: 'Emergency Medicine', 
    desc: 'Immediate care for acute illnesses and injuries.',
    image: 'https://images.unsplash.com/photo-1587350859728-117699f4a1ec?auto=format&fit=crop&q=80&w=600&h=300',
    tags: ['ER', 'Critical Care', 'Hospital']
  },
  { 
    id: '11',
    name: 'Ophthalmology', 
    desc: 'Vision care and treatment of eye disorders.',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600&h=300',
    tags: ['Vision', 'Specialist', 'Surgery']
  },
  { 
    id: '12',
    name: 'Gastroenterology', 
    desc: 'Digestive system and abdominal health.',
    image: 'https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&q=80&w=600&h=300',
    tags: ['Digestive', 'Specialist', 'Internal']
  },
  { 
    id: '13',
    name: 'Physical Therapy', 
    desc: 'Rehabilitation and movement disorders treatment.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600&h=300',
    tags: ['Rehab', 'Movement', 'Physical Therapy']
  },
  { 
    id: '14',
    name: 'Pulmonology', 
    desc: 'Respiratory system and lung health specialists.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=600&h=300',
    tags: ['Lungs', 'Internal', 'Hospital']
  }
];

const CategorySkeleton = () => (
  <div className="col-md-6 col-xl-4">
    <div className="card h-100 rounded-4 border-0 shadow-sm overflow-hidden">
      <div className="ratio ratio-21x9 bg-light"></div>
      <div className="card-body p-4">
        <div className="bg-light rounded h-4 w-50 mb-2"></div>
        <div className="bg-light rounded h-3 w-100"></div>
      </div>
    </div>
  </div>
);

const BrowseCategoriesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    ALL_CATEGORIES.forEach(cat => cat.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const filteredCategories = useMemo(() => {
    return ALL_CATEGORIES.filter(cat => {
      const matchesSearch = 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        cat.desc.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTags = 
        selectedTags.length === 0 || 
        selectedTags.some(tag => cat.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [searchTerm, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="bg-body-tertiary min-vh-100 py-5 animate-fade-in">
      <div className="container">
        <div className="card p-4 rounded-4 shadow-sm mb-5 border-0 bg-white">
          <h1 className="h3 fw-bold mb-4">Explore Specialties</h1>
          <div className="row g-3">
            <div className="col-md-9 position-relative">
              <Search className="position-absolute translate-middle-y top-50 ms-3 text-secondary" size={20} />
              <input 
                type="text" 
                placeholder="Search specialty, keyword or treatment..." 
                className="form-control form-control-lg ps-5 rounded-3 bg-body-tertiary border-0 shadow-none py-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary btn-lg w-100 rounded-3 shadow-sm fw-bold py-3">
                Find Specialties
              </button>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Sidebar Filters */}
          <aside className="col-lg-3">
            <div className="card p-4 rounded-4 shadow-sm border-0 sticky-top bg-white" style={{top: '100px'}}>
              <div className="d-flex align-items-center gap-2 mb-4 fw-bold text-dark border-bottom pb-3">
                <Filter size={18} />
                Filter by Focus
              </div>
              
              <div className="mb-2">
                <h4 className="x-small fw-black text-secondary text-uppercase mb-3 d-flex justify-content-between align-items-center" style={{fontSize: '0.65rem', letterSpacing: '0.05rem'}}>
                  Professional Tags
                </h4>
                <div className="d-flex flex-column gap-2" style={{maxHeight: '400px', overflowY: 'auto'}}>
                  {allTags.map(tag => (
                    <div key={tag} className="form-check">
                      <input 
                        className="form-check-input shadow-none" 
                        type="checkbox" 
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                      />
                      <label className="form-check-label small" htmlFor={`tag-${tag}`}>{tag}</label>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTags.length > 0 && (
                <button 
                  className="btn btn-link text-indigo btn-sm p-0 mt-3 text-decoration-none fw-bold"
                  onClick={() => setSelectedTags([])}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* Categories Grid */}
          <div className="col-lg-9">
            <div className="row g-4">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <div key={cat.id} className="col-md-6 col-xl-4">
                    <div className="card h-100 rounded-4 border-0 shadow-sm overflow-hidden hover-shadow transition-all bg-white">
                      <div className="ratio ratio-21x9 bg-secondary-subtle">
                         <img src={cat.image} className="object-fit-cover w-100 h-100" alt={cat.name} />
                         <div className="bg-dark bg-opacity-10"></div>
                      </div>
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h3 className="h6 fw-bold mb-0">{cat.name}</h3>
                          <span className="badge bg-indigo-subtle text-indigo rounded-pill x-small px-2">Focus</span>
                        </div>
                        <p className="text-secondary small mb-3 text-truncate-2" style={{fontSize: '0.8rem'}}>{cat.desc}</p>
                        <div className="d-flex flex-wrap gap-1 mt-auto">
                          {cat.tags.map(t => (
                            <span key={t} className="x-small bg-light text-secondary border px-2 py-1 rounded" style={{fontSize: '0.6rem'}}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="card p-5 rounded-5 border-0 shadow-sm text-center bg-white">
                    <Package size={48} className="text-light mb-4 mx-auto" />
                    <h3 className="h4 fw-bold">No specialties found</h3>
                    <p className="text-secondary small">Try searching for common medical terms like "Heart" or "Brain".</p>
                    <button 
                      className="btn btn-outline-indigo btn-sm mx-auto mt-2 px-4 rounded-pill fw-bold"
                      onClick={() => {setSearchTerm(''); setSelectedTags([]);}}
                    >
                      Reset All
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseCategoriesPage;
