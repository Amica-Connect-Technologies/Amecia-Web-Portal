import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, MapPin, Award, Search } from "lucide-react";

const ALL_PROS = [
  {
    id: "1",
    name: "Dr. Emily Watson",
    title: "Consultant Surgeon",
    specialty: "General Surgery",
    loc: "London, UK",
  },
  {
    id: "2",
    name: "James Morrison",
    title: "Nurse Practitioner",
    specialty: "Critical Care",
    loc: "Manchester, UK",
  },
  {
    id: "3",
    name: "Dr. Sarah Chen",
    title: "Pediatrician",
    specialty: "Early Childhood",
    loc: "Sydney, AU",
  },
  {
    id: "4",
    name: "Michael Ross",
    title: "Pharmacist",
    specialty: "Retail Pharmacy",
    loc: "New York, USA",
  },
  {
    id: "5",
    name: "Anna Belova",
    title: "Neurologist",
    specialty: "Brain Studies",
    loc: "Berlin, DE",
  },
  {
    id: "6",
    name: "David Kim",
    title: "Orthodontist",
    specialty: "Dental Braces",
    loc: "Seoul, KR",
  },
];

const HealthcareProfessionalsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredPros = useMemo(() => {
    return ALL_PROS.filter(
      (pro) =>
        pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pro.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="bg-body-tertiary min-vh-100 py-5 animate-fade-in">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="h2 fw-bold mb-2">Healthcare Professionals</h1>
          <p className="text-secondary small">
            Browse healthcare professionals and their qualifications
          </p>
        </div>

        <div
          className="card p-3 rounded-4 shadow-sm border-0 mb-5 mx-auto"
          style={{ maxWidth: "600px" }}
        >
          <div className="d-flex align-items-center bg-body-tertiary rounded-3 px-3">
            <Search className="text-secondary me-2" size={20} />
            <input
              type="text"
              placeholder="Search by name or specialty..."
              className="form-control border-0 bg-transparent py-3 shadow-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="row g-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="card h-100 rounded-5 border-0 shadow-sm p-5 bg-white animate-pulse">
                  <div
                    className="bg-light rounded-circle mx-auto mb-4"
                    style={{ width: "96px", height: "96px" }}
                  ></div>
                  <div className="bg-light rounded h-4 w-75 mx-auto mb-2"></div>
                  <div className="bg-light rounded h-3 w-50 mx-auto"></div>
                </div>
              </div>
            ))
          ) : filteredPros.length > 0 ? (
            filteredPros.map((pro) => (
              <div key={pro.id} className="col-md-6 col-lg-4">
                <div className="card h-100 rounded-5 border-0 shadow-sm p-4 text-center transition-all hover-shadow">
                  <div
                    className="mx-auto mb-4 position-relative"
                    style={{ width: "100px" }}
                  >
                    <div className="bg-light p-1 rounded-circle border border-2 border-indigo-subtle">
                      <img
                        src={`https://i.pravatar.cc/150?u=${pro.id}`}
                        alt={pro.name}
                        className="w-100 h-100 rounded-circle object-fit-cover"
                      />
                    </div>
                  </div>
                  <h3 className="h5 fw-bold mb-1">{pro.name}</h3>
                  <p className="text-indigo fw-bold small mb-4">{pro.title}</p>

                  <div className="d-flex flex-column gap-2 mb-4">
                    <div className="d-flex align-items-center justify-content-center gap-2 text-secondary small">
                      <Award size={14} className="text-indigo" />
                      <span>{pro.specialty}</span>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-2 text-secondary small">
                      <MapPin size={14} />
                      <span>{pro.loc}</span>
                    </div>
                  </div>

                  <Link
                    to={`/provider/${pro.id}`}
                    className="btn btn-primary w-100 rounded-3 py-3 fw-bold"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="bg-white p-5 rounded-5 border-0 shadow-sm d-inline-block">
                <User size={48} className="text-light mb-4" />
                <h3 className="h4 fw-bold">No Professionals Found</h3>
                <p className="text-secondary mb-0">
                  Try a different search term.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthcareProfessionalsPage;
