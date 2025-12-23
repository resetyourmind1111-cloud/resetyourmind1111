import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "I went from accepting breadcrumbs in every area of my life to demanding the feast. My income doubled within 3 months of doing this work.",
    author: "Sarah M.",
    role: "Entrepreneur",
    avatar: "SM",
    rating: 5,
  },
  {
    quote: "The Worth Thermostat Assessment was like looking in a mirror for the first time. I finally understood why I kept settling. Now I choose differently.",
    author: "Jennifer L.",
    role: "Creative Director",
    avatar: "JL",
    rating: 5,
  },
  {
    quote: "The oracle cards have become my daily ritual. Every morning I pull a card and it's always exactly what I need to hear. Life-changing.",
    author: "Amanda R.",
    role: "Life Coach",
    avatar: "AR",
    rating: 5,
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="glass-card p-6 md:p-8 relative"
    >
      <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
      
      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-accent text-accent" />
        ))}
      </div>
      
      <blockquote className="text-foreground text-lg leading-relaxed mb-6 relative z-10">
        "{testimonial.quote}"
      </blockquote>
      
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
          {testimonial.avatar}
        </div>
        <div>
          <p className="font-semibold text-foreground">{testimonial.author}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container relative mx-auto px-4 md:px-6">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Transformations
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            From Crumbs to{" "}
            <span className="gradient-text">Celebration</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Real stories from women who chose to reset their worth thermostat.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.author} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
