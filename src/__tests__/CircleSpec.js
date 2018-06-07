import Circle from '../Circle';
import { toMock } from 'to-mock';

describe('Circle', () => {
  let circle = null;

  const entry = {
    read() {},
    write() {},
    meta: {
      interval: 60
    },
    args: [],
    time: -60
  };

  const args = { event: 'event' };
  const payload = 111;

  const NativeDate = Date;
  const MockedDate = toMock(Date);

  beforeEach(() => {
    spyOn(MockedDate, 'now').and.returnValue(1);

    circle = new Circle();
    Date = MockedDate; // eslint-disable-line no-global-assign
  });

  afterEach(() => {
    Date = NativeDate; // eslint-disable-line no-global-assign
  });

  it('should call listen method for registering first entry', () => {
    spyOn(circle, '_listen');

    circle.register(entry);

    expect(circle._listen).toHaveBeenCalled();
    expect(circle.getEntries().size).toEqual(1);
  });

  it('should call unlisten method for unregistering last entry', () => {
    spyOn(circle, '_unlisten');

    const id = circle.register(entry);
    circle.unregister(id);

    expect(circle._unlisten).toHaveBeenCalled();
    expect(circle.getEntries().size).toEqual(0);
  });

  it('should call read method which return right structure for write method', () => {
    spyOn(entry, 'read').and.returnValue(payload);

    circle.register(entry);
    const entries = Array.from(circle.getEntries().values());

    expect(circle.read(entries, args)).toMatchSnapshot();
    expect(entry.read).toHaveBeenCalledWith(args);
  });

  it('should call read method which return right structure for write method', () => {
    spyOn(entry, 'write');

    circle.register(entry);
    const entries = Array.from(circle.getEntries().values()).map(entry =>
      Object.assign({ payload }, entry)
    );

    circle.write(entries, args);

    expect(entry.write).toHaveBeenCalledWith(
      Object.assign({ payload }, entry),
      args
    );
  });
});
