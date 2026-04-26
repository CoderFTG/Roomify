import { ArrowRight, ArrowUpRight, Clock, Layers, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import Button from "../../components/ui/Button";
import Upload from "../../components/Upload";
import { useNavigate, useOutletContext } from "react-router";
import { useEffect, useRef, useState } from "react";
import { createProject, getProjects } from "../../lib/puter.actions";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const { userName } = useOutletContext<AuthContext>();
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const isCreatingProjectRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUploadComplete = async (base64Image: string) => {
    try {

      if (isCreatingProjectRef.current) return false;
      isCreatingProjectRef.current = true;
      setIsProcessing(true);
      const newId = Date.now().toString();
      const name = `Residence ${newId}`;

      const newItem = {
        id: newId, name, sourceImage: base64Image,
        renderedImage: undefined,
        timestamp: Date.now()
      }

      const saved = await createProject({ item: newItem, visibility: 'private' });

      if (!saved) {
        console.error("Failed to create project");
        setIsProcessing(false);
        return false;
      }

      setProjects((prev) => [saved, ...prev]);

      navigate(`/visualizer/${newId}`, {
        state: {
          initialImage: saved.sourceImage,
          initialRendered: saved.renderedImage || null,
          name
        }
      });

      return true;
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      return false;
    } finally {
      isCreatingProjectRef.current = false;
    }
  }

  useEffect(() => {
        const fetchProjects = async () => {
            const items = await getProjects();

            setProjects(items)
        }

        fetchProjects();
    }, []);

  return (
    <div className="home">
      <Navbar />
      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>

          <p>Introducing Roomify</p>
        </div>

        <h1>Build beautiful spaces at the speed of thought with Roomify</h1>

        <p className="subtitle">
          Roomify is an AI-first design environment that helps you visualize, render, and ship architectural projects faster  than ever.
        </p>

        <div className="actions">
          <a href="#upload" className="cta">
            Start Building <ArrowRight className="icon" />
          </a>

          <Button variant="outline" size="lg" className="demo">
            Watch Demo
          </Button>
        </div>

        <div id="upload" className="upload-shell">
          <div className="grid-overlay" />

          {isProcessing ? (
            <div className="upload-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', minHeight: '300px' }}>
              <Loader2 className="icon" size={48} style={{ animation: 'spin 2s linear infinite', marginBottom: '1.5rem', color: 'currentColor' }} />
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              <h3>Setting up workspace...</h3>
              <p style={{ marginTop: '0.5rem', opacity: 0.7 }}>Please wait while we initialize your design environment.</p>
            </div>
          ) : (
            <div className="upload-card">
              <div className="upload-head">
                <div className="upload-icon">
                  <Layers className="icon" />
                </div>

                <h3>Upload your floor plan</h3>
                <p>Supports JPG, PNG, JPEG, WEBP, PDF formats up to 10MB</p>
              </div>

              <Upload onComplete={handleUploadComplete} />
            </div>
          )}
        </div>
      </section>

      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>Your latest work and shared community projects, all in one place.</p>
            </div>
          </div>

          <div className="projects-grid">
            {projects.map(({ id, name, renderedImage, sourceImage, timestamp, sharedBy }) => (
              <div key={id} className="project-card group" onClick={() => navigate(`/visualizer/${id}`)}>
                <div className="preview">
                  <img src={renderedImage || sourceImage} alt="Project"
                  />

                  <div className="badge">
                    <span>Community</span>
                  </div>
                </div>

                <div className="card-body">
                  <div>
                    <h3>{name}</h3>

                    <div className="meta">
                      <Clock size={12} />
                      <span>{new Date(timestamp).toLocaleDateString()}</span>
                      <span>By {sharedBy || userName || 'User'}</span>
                    </div>
                  </div>
                  <div className="arrow">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
