import Link from "next/link";
import { Shield, Lock, Target, Zap, Check, ArrowRight, Menu } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ApniSec
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors">
                Features
              </a>
              <a href="#services" className="text-gray-300 hover:text-purple-400 transition-colors">
                Services
              </a>
              <a href="#about" className="text-gray-300 hover:text-purple-400 transition-colors">
                About
              </a>
              <Link
                href="/login"
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
              >
                Login
              </Link>
            </div>

            <button className="md:hidden text-gray-300">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
              <span className="text-purple-300 text-sm font-medium">Trusted by 1000+ Organizations</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Secure Your Cloud.
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Protect Your Business.
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Comprehensive cybersecurity solutions designed to safeguard your digital infrastructure.
              From cloud security to penetration testing, we&apos;ve got you covered.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50 flex items-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#services"
                className="px-8 py-4 bg-slate-800/50 text-white rounded-full font-semibold hover:bg-slate-700/50 transition-all border border-purple-500/20"
              >
                Explore Services
              </a>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose <span className="text-purple-400">ApniSec</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Industry-leading security solutions backed by expert analysis and cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-slate-800/50 to-purple-900/20 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all hover:transform hover:scale-105"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-purple-400">Services</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Comprehensive security solutions tailored to your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative p-8 bg-slate-800/90 rounded-2xl border border-purple-500/20 h-full">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Secure Your Digital Assets?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of organizations that trust ApniSec for their cybersecurity needs
          </p>
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
          >
            <span>Start Your Free Trial</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-purple-500/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-8 h-8 text-purple-400" />
                <span className="text-xl font-bold text-white">ApniSec</span>
              </div>
              <p className="text-gray-400 text-sm">
                Securing your digital future with cutting-edge cybersecurity solutions.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Cloud Security</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Redteam Assessment</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">VAPT</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Email: contact@apnisec.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>24/7 Support Available</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-purple-500/20 text-center text-gray-400 text-sm">
            <p>&copy; 2024 ApniSec. All rights reserved. | Securing Your Digital Future</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const stats = [
  { value: "1000+", label: "Clients Protected" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7", label: "Support" },
  { value: "50M+", label: "Threats Blocked" },
];

const features = [
  {
    icon: <Shield className="w-7 h-7 text-white" />,
    title: "Advanced Protection",
    description: "Multi-layered security approach with real-time threat detection and automated response systems.",
  },
  {
    icon: <Zap className="w-7 h-7 text-white" />,
    title: "Lightning Fast",
    description: "Minimal latency with optimized security protocols that don't compromise on performance.",
  },
  {
    icon: <Lock className="w-7 h-7 text-white" />,
    title: "Enterprise Grade",
    description: "Bank-level encryption and compliance with international security standards and regulations.",
  },
];

const services = [
  {
    icon: "☁️",
    title: "Cloud Security",
    description: "Comprehensive cloud infrastructure protection with continuous monitoring and threat intelligence.",
    features: [
      "Real-time threat monitoring",
      "Automated security policies",
      "Compliance management",
      "Data encryption at rest & transit",
    ],
  },
  {
    icon: "🎯",
    title: "Redteam Assessment",
    description: "Simulated attacks to identify vulnerabilities before malicious actors can exploit them.",
    features: [
      "Advanced penetration testing",
      "Social engineering tests",
      "Physical security assessment",
      "Detailed remediation reports",
    ],
  },
  {
    icon: "🔍",
    title: "VAPT Services",
    description: "Vulnerability Assessment and Penetration Testing to uncover and fix security weaknesses.",
    features: [
      "Comprehensive vulnerability scanning",
      "Manual penetration testing",
      "Web & mobile app testing",
      "Network security audit",
    ],
  },
];
