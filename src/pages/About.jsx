import Section from '../components/Section';
import Card from '../components/Card';
import Button from '../components/Button';
import { Users, Award, Heart, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const whyUs = [
    {
      icon: Users,
      title: 'Talented Chefs',
      description: 'Our kitchen team serves freshly made meals with authentic recipes and premium ingredients.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Award,
      title: 'Quality Ingredients',
      description: 'We source the best local and imported produce to deliver flavor, health, and consistency.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your meal satisfaction is guaranteed. Pay online or pay on delivery with confidence.',
      color: 'from-rose-500 to-pink-500',
    },
  ];

  const stats = [
    { number: '15000+', label: 'Orders Delivered', icon: Award },
    { number: '12+', label: 'Years of Service', icon: Clock },
    { number: '97%', label: 'Happy Customers', icon: Heart },
    { number: '20', label: 'Delivery Zones', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Section className="pt-32 pb-24 bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Crafting Restaurant-Quality Meals
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Serving fast, convenient, and delicious food for online and delivery customers.
            </p>
          </motion.div>
        </div>
      </Section>

      <Section id="story" className="py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-8">
              <span className="inline-block px-4 py-1 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full mb-4">
                SINCE 2012
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Our Story
              </h2>
            </div>

            <Card className="p-10">
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We started as a small home kitchen with a big goal: to bring restaurant-quality dishes to every doorstep. Today, UB Restaurant serves thousands weekly with online checkout and safe cash-on-delivery options.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                From local classics to global favorites, our menu changes with the season while keeping the same high standards of taste, hygiene, and delivery speed.
              </p>
            </Card>

            <div className="mt-8">
              <Button size="lg" className="text-lg px-10">
                Explore the Full Menu
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                  <stat.icon className="w-8 h-8 text-amber-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      <Section id="mission" className="bg-white py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Customers Choose UB Restaurant
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We don’t just feed you — we make your meal moments memorable. Online payment, cash on delivery, and 7-day customer support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {whyUs.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="h-full p-10 hover:shadow-xl transition-all duration-300 group">
                <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-11 h-11 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {item.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default About;
