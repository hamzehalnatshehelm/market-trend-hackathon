import { Link } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  return (
    <div className="login-page" dir="rtl">
      <div className="login-container">
        <div className="welcome-icon">
          <svg
            className="icon-svg"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 17L9 11L13 15L21 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 7L21 13M21 7L15 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="page-title">مرحباً بك في اتجاهات السوق</h2>
        <p className="page-subtitle">
          منصة متكاملة لإدارة عمليات الشحن والاستيراد والتصدير بكفاءة عالية
        </p>

        <div className="buttons">
          <Link to="/" className="btn btn-primary">
            <span className="btn-icon">🔐</span>
            <span className="btn-text">تسجيل الدخول</span>
          </Link>

          <Link to="/subscribe" className="btn btn-secondary">
            <span className="btn-icon">✨</span>
            <span className="btn-text">إنشاء حساب جديد</span>
          </Link>
        </div>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">📊</div>
            <div className="feature-title">تقارير تحليلية متقدمة</div>
            <div className="feature-text">
              احصل على رؤى شاملة ومفصلة لجميع عمليات الشحن والمبيعات
            </div>
          </div>
        </div>
      </div>

      <div className="footer-note">
        © 2025 اتجاهات السوق - جميع الحقوق محفوظة
      </div>
    </div>
  );
}
