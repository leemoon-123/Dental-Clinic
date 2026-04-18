import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <path d="M12 19v3" />
                </svg>
              </div>
              <span className="text-xl font-bold text-foreground">DentaCare</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              He thong phong kham nha khoa hien dai voi doi ngu bac si chuyen nghiep, 
              trang thiet bi tien tien. Cham soc suc khoe rang mieng toan dien cho moi gia dinh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Lien ket nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#services"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dich vu
                </Link>
              </li>
              <li>
                <Link
                  href="/#doctors"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Doi ngu bac si
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ve chung toi
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dat lich hen
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Dich vu</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Kham tong quat</li>
              <li className="text-sm text-muted-foreground">Tram rang tham my</li>
              <li className="text-sm text-muted-foreground">Tay trang rang</li>
              <li className="text-sm text-muted-foreground">Nieng rang chinh nha</li>
              <li className="text-sm text-muted-foreground">Cay ghep Implant</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Lien he</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  123 Nguyen Hue, Quan 1, TP.HCM
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">1900-xxxx</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">contact@dentacare.vn</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  T2-T6: 8:00-20:00<br />
                  T7: 8:00-17:00<br />
                  CN: 8:00-12:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} DentaCare. Tat ca quyen duoc bao luu.
            </p>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Chinh sach bao mat
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dieu khoan su dung
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
