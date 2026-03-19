"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Briefcase,
  Info,
  Link2,
  MessageSquare,
  Send,
  Check,
  Loader2,
} from "lucide-react";
import emailjs from "@emailjs/browser";

// Social links data
const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/dev-hub85",
    icon: <Github className="w-5 h-5" />,
    color: "#FFFFFF",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/abdul-rehman-3b9213319",
    icon: <Linkedin className="w-5 h-5" />,
    color: "#0A66C2",
  },
  {
    name: "Email",
    url: "mailto:arehman652786@gmail.com",
    icon: <Mail className="w-5 h-5" />,
    color: "#EA4335",
  },
];

// Contact info data
const contactInfo = [
  {
    label: "Email",
    value: "arehman652786@gmail.com",
    icon: <Mail className="w-5 h-5" />,
  },
  {
    label: "Location",
    value: "Pakistan",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    label: "Availability",
    value: "Open for Opportunities",
    icon: <Briefcase className="w-5 h-5" />,
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent">(
    "idle"
  );
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendStatus("sending");

    try {
      const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceID || !templateID || !publicKey) {
        console.error("EmailJS environment variables are missing.");
        setSendStatus("idle");
        return;
      }

      const templateParams = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      await emailjs.send(serviceID, templateID, templateParams, publicKey);

      console.log("Email sent successfully:", templateParams);
      setSendStatus("sent");
      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setSubmitted(false);
        setSendStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Failed to send email:", error);
      setSendStatus("idle");
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full flex items-center justify-center py-24 overflow-hidden"
    >
      <div className="w-full max-w-6xl px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <p
            className="text-blue-400 text-xs md:text-sm tracking-widest font-medium mb-4"
            style={{
              textShadow:
                "0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(59,130,246,0.3)",
            }}
          >
            Get In Touch
          </p>

          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            style={{
              textShadow:
                "0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(59,130,246,0.3), 0 0 60px rgba(107,84,188,0.2)",
            }}
          >
            Contact Me
          </h2>

          <p
            className="mt-4 text-white/80 text-base md:text-lg max-w-3xl mx-auto leading-relaxed"
            style={{
              textShadow:
                "0 0 10px rgba(255,255,255,0.2), 0 0 20px rgba(59,130,246,0.1)",
            }}
          >
            Have a project in mind or want to collaborate? I&apos;d love to hear
            from you. Feel free to reach out through any of the channels below
            or send me a message directly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info & Social Links */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-8"
          >
            {/* Contact Info Card */}
            <div
              className="relative rounded-2xl backdrop-blur-xl border border-white/10 hover:border-purple-500/60 transition-all duration-500 overflow-hidden p-6"
              style={{
                background:
                  "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 70%)",
                }}
              />

              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  Contact Information
                </h3>

                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        {info.icon}
                      </div>
                      <div>
                        <p className="text-white/50 text-xs">{info.label}</p>
                        <p className="text-white font-medium">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links Card */}
            <div
              className="relative rounded-2xl backdrop-blur-xl border border-white/10 hover:border-purple-500/60 transition-all duration-500 overflow-hidden p-6"
              style={{
                background:
                  "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 70%)",
                }}
              />

              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-blue-400" />
                  Connect With Me
                </h3>

                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 px-4 py-3 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/60 transition-all duration-300"
                    >
                      <div
                        className="text-white/70 group-hover:text-white transition-colors"
                        style={{ color: social.color }}
                      >
                        {social.icon}
                      </div>
                      <span className="text-white/70 group-hover:text-white font-medium transition-colors">
                        {social.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className="relative rounded-2xl backdrop-blur-xl border border-white/10 hover:border-purple-500/60 transition-all duration-500 overflow-hidden p-6"
            style={{
              background:
                "linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-white/70 text-sm mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/60 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-white/70 text-sm mb-2"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/60 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-white/70 text-sm mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/60 transition-colors"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-white/70 text-sm mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/60 transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendStatus === "sending"}
                  className="w-full py-3 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendStatus === "sending" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : sendStatus === "sent" ? (
                    <>
                      <Check className="w-5 h-5" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
