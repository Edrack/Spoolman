import { Col, Form, InputNumber, QRCode, Row, Slider, Switch } from "antd";
import { useSavedState } from "../../utils/saveload";
import PrintingDialog from "./printingDialog";
import { useTranslate } from "@refinedev/core";

interface QRCodeData {
  value: string;
  label?: string;
  errorLevel?: "L" | "M" | "Q" | "H";
}

interface QRCodePrintingDialogProps {
  visible: boolean;
  items: QRCodeData[];
  onCancel: () => void;
}

const QRCodePrintingDialog: React.FC<QRCodePrintingDialogProps> = ({
  visible,
  items,
  onCancel,
}) => {
  const t = useTranslate();

  const [showContent, setShowContent] = useSavedState(
    "print-showContent",
    true
  );
  const [textSize, setTextSize] = useSavedState("print-textSize", 5);
  const [showSpoolmanIcon, setShowSpoolmanIcon] = useSavedState(
    "print-showSpoolmanIcon",
    true
  );

  const elements = items.map((item) => {
    return (
      <>
        <QRCode
          className="print-qrcode"
          icon={showSpoolmanIcon ? "/favicon.ico" : undefined}
          value={item.value}
          errorLevel={item.errorLevel}
          type="svg"
          color="#000"
        />
        {showContent && (
          <div
            className="print-qrcode-title"
            style={{ textAlign: "center", color: "#000" }}
          >
            {item.label ?? item.value}
          </div>
        )}
      </>
    );
  });

  return (
    <PrintingDialog
      visible={visible}
      title={t("printing.qrcode.title")}
      items={elements}
      extraSettings={
        <>
          <Form.Item label={t("printing.qrcode.showContent")}>
            <Switch
              checked={showContent}
              onChange={(checked) => setShowContent(checked)}
            />
          </Form.Item>
          <Form.Item label={t("printing.qrcode.textSize")}>
            <Row>
              <Col span={12}>
                <Slider
                  disabled={!showContent}
                  tooltip={{ formatter: (value) => `${value} mm` }}
                  min={3}
                  max={15}
                  value={textSize}
                  step={0.1}
                  onChange={(value) => {
                    setTextSize(value);
                  }}
                />
              </Col>
              <Col span={12}>
                <InputNumber
                  disabled={!showContent}
                  min={0.01}
                  step={0.1}
                  style={{ margin: "0 16px" }}
                  value={textSize}
                  addonAfter="mm"
                  onChange={(value) => {
                    setTextSize(value ?? 5);
                  }}
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label={t("printing.qrcode.showSpoolmanIcon")}>
            <Switch
              checked={showSpoolmanIcon}
              onChange={(checked) => setShowSpoolmanIcon(checked)}
            />
          </Form.Item>
        </>
      }
      style={`
            .print-page .print-qrcode {
                height: 100% !important;
                width: 100% !important;
            }

            .print-page .print-qrcode-title {
                font-size: ${textSize}mm;
            }

            .print-page svg {
                display: block;
                height: 100%;
                width: auto;
            }
            `}
      onCancel={onCancel}
    />
  );
};

export default QRCodePrintingDialog;
