import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Calendar,
  Users,
  Award,
  Clock,
  Shield,
  Star,
  Phone,
} from "lucide-react";

const services = [
  {
    title: "Khám tổng quát",
    description: "Kiểm tra sức khỏe răng miệng toàn diện, phát hiện sớm các vấn đề",
    price: "200.000đ",
    icon: CheckCircle,
  },
  {
    title: "Trám răng thẩm mỹ",
    description: "Phục hồi răng sâu, mất răng bằng vật liệu cao cấp",
    price: "300.000đ - 800.000đ",
    icon: Award,
  },
  {
    title: "Tẩy trắng răng",
    description: "Làm trắng răng an toàn, hiệu quả với công nghệ hiện đại",
    price: "1.500.000đ - 3.000.000đ",
    icon: Star,
  },
  {
    title: "Niềng răng chỉnh nha",
    description: "Chỉnh nha thẩm mỹ, niềng răng mắc cài và trong suốt",
    price: "20.000.000đ - 80.000.000đ",
    icon: Shield,
  },
];

const features = [
  {
    title: "Đội ngũ bác sĩ chuyên nghiệp",
    description: "Các bác sĩ giàu kinh nghiệm, được đào tạo chuyên sâu",
    icon: Users,
  },
  {
    title: "Trang thiết bị hiện đại",
    description: "Sử dụng công nghệ tiên tiến nhất trong ngành nha khoa",
    icon: Award,
  },
  {
    title: "Đặt lịch dễ dàng",
    description: "Đặt lịch hẹn trực tuyến 24/7, nhận thông báo tự động",
    icon: Calendar,
  },
  {
    title: "Hỗ trợ tận tâm",
    description: "Dịch vụ chăm sóc khách hàng 24/7, tư vấn miễn phí",
    icon: Phone,
  },
];

const doctors = [
  {
    name: "BS. Nguyễn Văn A",
    specialty: "Chỉnh nha",
    experience: "15 năm kinh nghiệm",
    rating: 4.9,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor1",
  },
  {
    name: "BS. Trần Thị B",
    specialty: "Nha khoa tổng quát",
    experience: "12 năm kinh nghiệm",
    rating: 4.8,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor2",
  },
  {
    name: "BS. Lê Văn C",
    specialty: "Phẫu thuật Implant",
    experience: "10 năm kinh nghiệm",
    rating: 4.9,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor3",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                  Chăm sóc sức khỏe răng miệng{" "}
                  <span className="text-primary">chuyên nghiệp</span>
                </h1>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  DentaCare mang đến dịch vụ nha khoa chất lượng cao với đội ngũ bác sĩ 
                  chuyên nghiệp và trang thiết bị hiện đại. Đặt lịch hẹn dễ dàng, theo dõi 
                  lịch sử khám và nhận tư vấn miễn phí.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link href="/register">
                      <Calendar className="mr-2 h-5 w-5" />
                      Đặt lịch ngay
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/#services">Tìm hiểu thêm</Link>
                  </Button>
                </div>
                <div className="mt-12 flex gap-8">
                  <div>
                    <p className="text-3xl font-bold text-primary">10+</p>
                    <p className="text-sm text-muted-foreground">Năm kinh nghiệm</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">50K+</p>
                    <p className="text-sm text-muted-foreground">Khách hàng</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">4.9</p>
                    <p className="text-sm text-muted-foreground">Đánh giá</p>
                  </div>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="relative rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8">
                  <img
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=600&fit=crop"
                    alt="Chăm sóc nha khoa"
                    className="rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Dịch vụ của chúng tôi
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                DentaCare cung cấp đa dạng dịch vụ nha khoa từ khám tổng quát đến 
                các dịch vụ thẩm mỹ và phẫu thuật chuyên sâu
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <Card key={service.title} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold text-primary">{service.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Xem tất cả dịch vụ</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Tại sao chọn DentaCare?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Chúng tôi cam kết mang đến trải nghiệm dịch vụ nha khoa tốt nhất cho khách hàng
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        <section id="doctors" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Đội ngũ bác sĩ
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Đội ngũ bác sĩ giàu kinh nghiệm, tận tâm với bệnh nhân
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <Card key={doctor.name} className="text-center">
                  <CardHeader>
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="mx-auto h-24 w-24 rounded-full bg-muted"
                    />
                    <CardTitle className="mt-4">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{doctor.experience}</p>
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{doctor.rating}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="bg-primary py-20 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl text-balance">
              Sẵn sàng chăm sóc sức khỏe răng miệng?
            </h2>
            <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
              Đặt lịch hẹn ngay hôm nay để được tư vấn và khám miễn phí. 
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">
                  <Calendar className="mr-2 h-5 w-5" />
                  Đặt lịch hẹn
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="tel:1900xxxx">
                  <Phone className="mr-2 h-5 w-5" />
                  1900-xxxx
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Working Hours */}
        <section id="about" className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                  Giờ làm việc
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Chúng tôi phục vụ bạn 6 ngày trong tuần với lịch trình linh hoạt
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <span className="font-medium">Thứ 2 - Thứ 6</span>
                    <span className="text-muted-foreground">8:00 - 20:00</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <span className="font-medium">Thứ 7</span>
                    <span className="text-muted-foreground">8:00 - 17:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Chủ nhật</span>
                    <span className="text-muted-foreground">8:00 - 12:00</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Card className="w-full">
                  <CardHeader>
                    <Clock className="h-12 w-12 text-primary" />
                    <CardTitle className="mt-4">Đặt lịch hẹn nhanh</CardTitle>
                    <CardDescription>
                      Đăng ký tài khoản để đặt lịch hẹn trực tuyến nhanh chóng và tiện lợi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" asChild>
                      <Link href="/register">Bắt đầu ngay</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
