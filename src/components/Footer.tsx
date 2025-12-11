import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Floral divider */}
      <div className="h-1 bg-gradient-to-r from-blush via-gold to-peach" />
      
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-2xl font-semibold">Beyond House</h3>
              <p className="text-sm text-background/60 tracking-widest uppercase">
                Interior Consultancy
              </p>
            </div>
            <p className="text-background/80 text-sm leading-relaxed">
              Transforming your space beyond imagination with premium interior construction 
              and design consultancy services.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://instagram.com/beyondhouseinteriors" target="_blank" rel="noopener noreferrer" className="text-background/60 hover:text-gold transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {["Home", "About", "Services", "Portfolio", "Consultancy", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-background/80 hover:text-gold transition-colors duration-200 text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {["Ceiling Design", "Custom Cabinetry", "Walls & Décor", "Flooring Solutions"].map((item) => (
                <li key={item}>
                  <Link
                    to="/services"
                    className="text-background/80 hover:text-gold transition-colors duration-200 text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-background/80 text-sm">
                  Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                <a href="tel:+254791996448" className="text-background/80 hover:text-gold transition-colors text-sm">
                  0791 996448
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                <a href="mailto:Beyondhouseint@gmail.com" className="text-background/80 hover:text-gold transition-colors text-sm">
                  Beyondhouseint@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © {new Date().getFullYear()} Beyond House. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-background/60 hover:text-gold transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-background/60 hover:text-gold transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
