package systems.cytohelix.klinikpro.finances.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import systems.cytohelix.klinikpro.agenda.domain.Appointment;
import systems.cytohelix.klinikpro.agenda.domain.AppointmentStatus;
import systems.cytohelix.klinikpro.agenda.repository.AppointmentRepository;
import systems.cytohelix.klinikpro.core.exception.ResourceNotFoundException;
import systems.cytohelix.klinikpro.finances.domain.Invoice;
import systems.cytohelix.klinikpro.finances.domain.InvoiceStatus;
import systems.cytohelix.klinikpro.finances.domain.Payment;
import systems.cytohelix.klinikpro.finances.domain.PaymentMethod;
import systems.cytohelix.klinikpro.finances.dto.PayAppointmentRequest;
import systems.cytohelix.klinikpro.finances.repository.InvoiceRepository;
import systems.cytohelix.klinikpro.finances.repository.PaymentRepository;
import systems.cytohelix.klinikpro.tenancy.service.AbstractTenantScopedService;

import java.util.UUID;

@Service
public class FinanceService extends AbstractTenantScopedService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final AppointmentRepository appointmentRepository;

    public FinanceService(InvoiceRepository invoiceRepository,
                          PaymentRepository paymentRepository,
                          AppointmentRepository appointmentRepository) {
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional
    public Invoice processPayment(PayAppointmentRequest request) {
        initTenantSession();
        UUID tenantId = currentTenantId();
        UUID branchId = currentBranchId();

        // 1. Obtener la Cita y actualizar estado a Finalizada
        Appointment appointment = null;
        if (request.appointmentId() != null) {
            appointment = appointmentRepository.findById(request.appointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment", request.appointmentId().toString()));
            
            appointment.setEstado(AppointmentStatus.Finalizada);
            appointmentRepository.save(appointment);
        }

        // 2. Crear la Factura (Invoice)
        Invoice invoice = Invoice.builder()
                .tenantId(tenantId)
                .branchId(branchId)
                .patientId(request.patientId() != null ? request.patientId() : (appointment != null ? appointment.getPatientId() : null))
                .appointmentId(request.appointmentId())
                .totalAmount(request.amount())
                .status(InvoiceStatus.PAID)
                .build();
        
        invoice = invoiceRepository.save(invoice);

        // 3. Registrar el Pago (Payment)
        Payment payment = Payment.builder()
                .tenantId(tenantId)
                .invoiceId(invoice.getId())
                .amount(request.amount())
                .paymentMethod(PaymentMethod.valueOf(request.paymentMethod().toUpperCase()))
                .build();
                
        paymentRepository.save(payment);

        return invoice;
    }
}
