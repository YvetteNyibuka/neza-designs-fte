import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Icon } from "@iconify/react";

const services = [
  {
    id: "architecture",
    title: "Architecture Design",
    description: "We blend cultural resonance with modern innovation to create spaces that inspire. Our architectural approach is rooted in sustainability,contextual relevance, and aesthetic excellence, ensuring every structure tells a unique story.",
    features: ["Conceptual Design", "Interior Design", "3D Visualization", "Urban Planning"],
    EachFeatureIcon: ["mdi:pencil-ruler", "mdi:sofa-outline", "mdi:cube-outline", "mdi:city-variant-outline"],
    EachFeatureMeaning: ["Initial sketches and ideation.", "Luxury and interior crafting.", "Photorealistic renders.", "Community-focused layouts."],
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop",
    buttonTitle:"View Case Studies"
  },
  {
    id: "Construction",
    title: "Construction",
    description: "Building the backbone of infrastructure with precision and durability.Our engineering solutions utilize advanced structural analysis and sustainable materials to ensure safety, efficiency, and longevity for every project we undertake.",
    features: ["Structural Analysis", "Water Systems", "Roadways", "Geotechnical"],
    EachFeatureIcon: ["mdi:office-building-outline", "mdi:water-outline", "mdi:road-variant", "mdi:shovel"],
    EachFeatureMeaning: ["Load-bearing calculations.", "Sustainable management.", "Transport infrastructure.", "Soil and foundation studies."],
    image: "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop",
    buttonTitle:"View Engineering Projects"
  },
  {
    id: "project-management",
    title: "Project Management",
    description: "From inception to handover, we oversee every detail. Our meticulous project management methodology ensures timelines are met, budgets are strictly adhered to, and quality is never compromised, deliveringpeace of mind.",
    features: ["Cost Estimation", "Timeline Planning", "Contract Admin", "Site Supervision"],
    EachFeatureIcon: ["mdi:cash-multiple", "mdi:timeline-clock-outline", "mdi:file-document-edit-outline", "mdi:hard-hat"],
    EachFeatureMeaning: ["Accurate forecasting.", "Efficient scheduling.", "Vendor management.", "On-site quality control."],
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop",
    buttonTitle:"See Our Processes"
  },
  {
    id: "land",
    title: "Land Acquisition",
    description: "Navigating the complexities of land procurement in emerging markets. We assist clients in identifying, evaluating, and securing prime real estate for development, ensuring all legal and topographic requirements are met for a solid foundation..",
    features: ["Site Selection", "Topographic Surveys", "Legal Due Diligence", "Feasibility Studies"],
    EachFeatureIcon: ["mdi:map-marker-radius-outline", "mdi:map-legend", "mdi:scale-balance", "mdi:chart-areaspline"],
    EachFeatureMeaning: ["Strategic location analysis.", "Land contour mapping.", "Title verification & permits.", "ROI & market assessment."],
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop",
    buttonTitle:"Consult Us"
  }
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col flex-1 w-full bg-neutral-50 pb-0">
      {/* Hero */}
      <section className="relative w-full h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1481253127861-534498168948?q=80&w=1973&auto=format&fit=crop"
            alt="Services background"
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
            Integrated Expertise for Tomorrow's Cities
          </h1>
          <p className="text-lg text-white/80 font-light mb-8 max-w-2xl mx-auto">
            A premium suite of services working seamlessly together to achieve exceptional built environments.
          </p>
          <Button size="lg" className="h-14 px-8 text-base">
            Consult With Us
          </Button>
        </div>
      </section>

      {/* Services List Alternating */}
      <div className="container mx-auto px-4 md:px-8 max-w-7xl py-24 space-y-32">
        {services.map((svc, idx) => (
          <section key={svc.id} id={svc.id} className="scroll-mt-32">
            <div className={`flex flex-col md:flex-row gap-16 lg:gap-24 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-primary text-xs font-bold tracking-widest uppercase">
                    Service {String(idx + 1).padStart(2, '0')}
                  </div>
                </div>
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
                  {svc.title}
                </h2>
                <p className="text-neutral-600 text-lg leading-relaxed mb-8">
                  {svc.description}
                </p>
                
                <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                  {svc.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <Icon
                        icon={svc.EachFeatureIcon[fIdx]}
                        width={20}
                        height={20}
                        className="text-primary opacity-80 shrink-0 mt-0.5"
                      />
                      <div>
                        <div className="text-sm text-neutral-700 font-medium leading-snug">{feature}</div>
                        <div className="text-xs text-neutral-400 mt-0.5 leading-snug">{svc.EachFeatureMeaning[fIdx]}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12">
                  <Button variant="outline" className="border-black text-black rounded-md bg-white hover:bg-black  hover:text-white transition-colors duration-100">
                    {svc.buttonTitle}
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 w-full">
                <div className="relative h-[400px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-xl border border-neutral-100">
                  <Image src={svc.image} alt={svc.title} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Bottom CTA */}
      <section className="py-24 bg-primary text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">Ready to Build the Future?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg">
            Whether you are planning a commercial development or a bespoke residential masterpiece, NEEZA brings your vision to life.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-white text-primary hover:bg-neutral-100">Start a Project</Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Contact Us</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
